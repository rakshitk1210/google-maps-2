import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AMBIENT_MESSAGES,
  FALLBACK_REPLIES,
  REPLY_RULES,
  SEED_MESSAGES,
} from './chatData'
import type { ChatMessage, ScriptedReply } from './chatData'

export interface TypingState {
  authorId: string
}

export interface ChatEngine {
  messages: ChatMessage[]
  typing: TypingState | null
  unreadCount: number
  sendMessage: (text: string) => void
  markRead: () => void
}

// All simulated-chat state and every timer behind it, in one hook so cleanup
// is centralized: unmounting (switching iterations mid-reply) clears every
// pending timeout. `active` starts the ambient timeline (the moment the FAB
// appears); `chatOpen` decides whether arrivals count as unread.
export function useChatEngine(active: boolean, chatOpen: boolean): ChatEngine {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES)
  const [typing, setTyping] = useState<TypingState | null>(null)
  // The two seed openers are "unread" until the sheet is first opened, so the
  // FAB lands already badged — that's the invitation to tap it.
  const [unreadCount, setUnreadCount] = useState(
    SEED_MESSAGES.filter((m) => m.kind !== 'system').length,
  )

  // Ambient/reply callbacks fire long after render — read openness via a ref
  // so they never see a stale value.
  const chatOpenRef = useRef(chatOpen)
  useEffect(() => {
    chatOpenRef.current = chatOpen
  }, [chatOpen])

  const timersRef = useRef<number[]>([])
  const schedule = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms))
  }, [])
  useEffect(
    () => () => {
      timersRef.current.forEach((id) => clearTimeout(id))
    },
    [],
  )

  const idRef = useRef(0)
  const appendIncoming = useCallback((msg: Omit<ChatMessage, 'id'>) => {
    idRef.current += 1
    setMessages((prev) => [...prev, { ...msg, id: `m${idRef.current}` }])
    if (!chatOpenRef.current) setUnreadCount((n) => n + 1)
  }, [])

  // Ambient chatter — scheduled once, when the chat comes into existence.
  const ambientStarted = useRef(false)
  useEffect(() => {
    if (!active || ambientStarted.current) return
    ambientStarted.current = true
    for (const ambient of AMBIENT_MESSAGES) {
      schedule(
        () => appendIncoming({ kind: 'text', authorId: ambient.authorId, text: ambient.text }),
        ambient.afterMs,
      )
    }
  }, [active, appendIncoming, schedule])

  const usedRules = useRef(new Set<number>())
  const fallbackIdx = useRef(0)

  const sendMessage = useCallback(
    (raw: string) => {
      const text = raw.trim()
      if (!text) return
      idRef.current += 1
      setMessages((prev) => [...prev, { id: `m${idRef.current}`, kind: 'text', authorId: 'you', text }])

      // First unused rule with a keyword hit wins; otherwise rotate fallbacks.
      const lower = text.toLowerCase()
      const ruleIdx = REPLY_RULES.findIndex(
        (rule, i) => !usedRules.current.has(i) && rule.keywords.some((k) => lower.includes(k)),
      )
      let replies: ScriptedReply[]
      if (ruleIdx >= 0) {
        usedRules.current.add(ruleIdx)
        replies = REPLY_RULES[ruleIdx].replies
      } else {
        replies = [FALLBACK_REPLIES[fallbackIdx.current % FALLBACK_REPLIES.length]]
        fallbackIdx.current += 1
      }

      // Chain each reply: pause → typing indicator → message lands.
      let at = 0
      for (const reply of replies) {
        at += reply.typingDelayMs
        const showTypingAt = at
        schedule(() => setTyping({ authorId: reply.authorId }), showTypingAt)
        at += reply.typingDurationMs
        schedule(() => {
          setTyping(null)
          appendIncoming({
            kind: reply.photoUrl ? 'photo' : 'text',
            authorId: reply.authorId,
            text: reply.text,
            photoUrl: reply.photoUrl,
          })
        }, at)
      }
    },
    [appendIncoming, schedule],
  )

  const markRead = useCallback(() => setUnreadCount(0), [])

  return { messages, typing, unreadCount, sendMessage, markRead }
}
