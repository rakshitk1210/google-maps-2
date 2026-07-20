import { useCallback, useEffect, useState } from 'react'
import {
  APPEAR_MS,
  DECLINED_MS,
  DOWNLOADED_MS,
  GEMINI_DECLINED_LINE,
  GEMINI_DOWNLOADED_LINE,
  GEMINI_PROMPT,
  LISTENING_TIMEOUT_MS,
  PROCESSING_MS,
  SPEAKING_MAX_MS,
} from './data'
import { listenForReply, speak } from './speech'

// Gemini voice-session states, per the sketch's button choreography. Nothing
// is drawn as text — the orb is the only visual, and the exchange itself is
// audio: spark appears → speaking (glow, real TTS) → listening (mic, verbal
// reply) → processing (loader) → spoken confirmation → terminal.
export type GeminiState =
  | 'hidden'
  | 'appearing'
  | 'speaking'
  | 'listening'
  | 'processing'
  | 'downloaded'
  | 'declined'
  | 'idleDone'
  | 'dismissed'

export type GeminiReply = 'yes' | 'no'

// Waits idle in 'hidden' until trigger() is called (a presenter button press —
// see GoogleMapsClone) rather than auto-playing on mount. Once triggered, the
// reply is verbal (speech recognition) with a presenter keyboard fallback
// (Y / N) and an auto-"yes" timeout, since there is no guaranteed microphone
// behind the demo.
export function useGeminiFlow() {
  const [state, setState] = useState<GeminiState>('hidden')
  const [reply, setReply] = useState<GeminiReply | null>(null)
  // Bumped by trigger() so every timer/animation/utterance restarts cleanly.
  const [runId, setRunId] = useState(0)

  const resolveReply = useCallback((answer: GeminiReply) => {
    setReply(answer)
    setState(answer === 'yes' ? 'processing' : 'declined')
  }, [])

  // One effect per state entry: schedules the next step and wires up whatever
  // audio / input that state needs, cleaning it all up on exit.
  useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    const cleanups: Array<() => void> = []
    const after = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => !cancelled && fn(), ms))
    }

    switch (state) {
      case 'hidden':
        // Idle — waits for trigger() to move to 'appearing'.
        break
      case 'appearing':
        after(APPEAR_MS, () => setState('speaking'))
        break
      case 'speaking': {
        // Advance to listening when Gemini finishes speaking; a ceiling timer
        // covers environments where audio (and its onend) never fire.
        let advanced = false
        const toListening = () => {
          if (advanced) return
          advanced = true
          if (!cancelled) setState('listening')
        }
        cleanups.push(speak(GEMINI_PROMPT, toListening))
        after(SPEAKING_MAX_MS, toListening)
        break
      }
      case 'listening': {
        cleanups.push(listenForReply((answer) => !cancelled && resolveReply(answer)))
        const onKeyDown = (event: KeyboardEvent) => {
          const key = event.key.toLowerCase()
          if (key === 'y') resolveReply('yes')
          if (key === 'n') resolveReply('no')
        }
        window.addEventListener('keydown', onKeyDown)
        cleanups.push(() => window.removeEventListener('keydown', onKeyDown))
        after(LISTENING_TIMEOUT_MS, () => resolveReply('yes'))
        break
      }
      case 'processing':
        after(PROCESSING_MS, () => setState('downloaded'))
        break
      case 'downloaded':
        cleanups.push(speak(GEMINI_DOWNLOADED_LINE))
        after(DOWNLOADED_MS, () => setState('idleDone'))
        break
      case 'declined':
        cleanups.push(speak(GEMINI_DECLINED_LINE))
        after(DECLINED_MS, () => setState('dismissed'))
        break
    }

    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
      cleanups.forEach((fn) => fn())
    }
  }, [state, runId, resolveReply])

  // Starts (or restarts, if mid-flow) the scripted exchange. Bumping runId
  // forces the effect above to tear down any in-flight timers/speech before
  // the new run's 'appearing' effect fires.
  const trigger = useCallback(() => {
    setReply(null)
    setRunId((id) => id + 1)
    setState('appearing')
  }, [])

  return { state, reply, resolveReply, trigger, runId }
}
