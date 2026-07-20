// Audio for the Gemini exchange. Output uses ElevenLabs TTS when a key is
// configured (VITE_ELEVENLABS_API_KEY), falling back to the browser's built-in
// speechSynthesis if the key is absent or the request fails, so the demo always
// speaks. Input uses the browser's SpeechRecognition where a mic is available.
// Everything degrades gracefully: callbacks still fire (or no-op) so the
// scripted flow never stalls.

export type Reply = 'yes' | 'no'

// ElevenLabs config. "Sarah" is a premade voice usable on the free plan (shared
// Voice-Library voices require a paid plan via the API); turbo model keeps
// latency low for a real-time feel. The key is a Vite env var (client-exposed —
// fine for a local prototype, proxy it for production).
const ELEVEN_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined
const ELEVEN_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const ELEVEN_MODEL = 'eleven_turbo_v2_5'

async function fetchElevenAudio(text: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVEN_KEY as string,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: ELEVEN_MODEL,
      voice_settings: { stability: 0.4, similarity_boost: 0.75 },
    }),
    signal,
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}`)
  return URL.createObjectURL(await res.blob())
}

// Browser-native fallback voice.
function speakWebSpeech(text: string, onEnd?: () => void): () => void {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
  if (!synth) {
    onEnd?.()
    return () => {}
  }
  try {
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.02
    utterance.pitch = 1
    let done = false
    const finish = () => {
      if (done) return
      done = true
      onEnd?.()
    }
    utterance.onend = finish
    utterance.onerror = finish
    synth.speak(utterance)
    return () => {
      utterance.onend = null
      utterance.onerror = null
      try {
        synth.cancel()
      } catch {
        /* nothing playing */
      }
    }
  } catch {
    onEnd?.()
    return () => {}
  }
}

// Speak `text` aloud (ElevenLabs → browser fallback). Calls `onEnd` when
// playback finishes. Returns a canceller that stops audio and any in-flight
// request. The flow's speaking→listening transition keys off `onEnd`.
export function speak(text: string, onEnd?: () => void): () => void {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    onEnd?.()
  }

  // No key configured — use the browser voice directly.
  if (!ELEVEN_KEY) return speakWebSpeech(text, finish)

  const controller = new AbortController()
  let audio: HTMLAudioElement | null = null
  let objectUrl: string | null = null
  let fallbackCancel: (() => void) | null = null

  fetchElevenAudio(text, controller.signal)
    .then((url) => {
      if (done) {
        URL.revokeObjectURL(url)
        return
      }
      objectUrl = url
      audio = new Audio(url)
      audio.onended = finish
      const toFallback = () => {
        if (!done) fallbackCancel = speakWebSpeech(text, finish)
      }
      audio.onerror = toFallback
      // play() can reject (autoplay policy) — fall back to the browser voice.
      audio.play().catch(toFallback)
    })
    .catch(() => {
      // Network / CORS / quota failure → browser voice so Gemini still speaks.
      if (!done && !controller.signal.aborted) fallbackCancel = speakWebSpeech(text, finish)
    })

  return () => {
    done = true
    controller.abort()
    if (audio) {
      audio.onended = null
      audio.onerror = null
      try {
        audio.pause()
      } catch {
        /* not playing */
      }
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    fallbackCancel?.()
  }
}

type SpeechRecognitionCtor = new () => {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

const YES = /\b(yes|yeah|yep|yup|sure|okay|ok|please|download|do it|go ahead)\b/
const NO = /\b(no|nope|nah|skip|don'?t|do not|cancel)\b/

// Listen for a spoken yes/no. Returns a canceller. No-ops (returns immediately)
// where the API or a microphone isn't available — the caller keeps keyboard
// and timeout fallbacks for that case.
export function listenForReply(onReply: (reply: Reply) => void): () => void {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  const Recognition = w.SpeechRecognition ?? w.webkitSpeechRecognition
  if (!Recognition) return () => {}
  try {
    const recognition = new Recognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.toLowerCase() ?? ''
      if (YES.test(transcript)) onReply('yes')
      else if (NO.test(transcript)) onReply('no')
    }
    recognition.start()
    return () => {
      recognition.onresult = null
      recognition.onerror = null
      try {
        recognition.stop()
      } catch {
        /* already stopped */
      }
    }
  } catch {
    return () => {}
  }
}
