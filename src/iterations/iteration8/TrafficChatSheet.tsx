import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Box, ButtonBase, InputBase, Typography } from '@mui/material'
import ForumIcon from '@mui/icons-material/Forum'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {
  CHAT_PLACEHOLDER,
  CHAT_SUBTITLE,
  CHAT_TITLE,
  participantById,
} from './chatData'
import type { ChatMessage } from './chatData'
import type { TypingState } from './useChatEngine'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface TrafficChatSheetProps {
  open: boolean
  messages: ChatMessage[]
  typing: TypingState | null
  onClose: () => void
  onSend: (text: string) => void
}

// 32px initial-letter circle for a stranger in the jam.
function StrangerAvatar({ authorId }: { authorId: string }) {
  const p = participantById(authorId)
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        flexShrink: 0,
        bgcolor: p?.color ?? tokens.inkSecondary,
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {p?.initial ?? '?'}
    </Box>
  )
}

interface MessageRowProps {
  message: ChatMessage
  /** Re-pin the list to the bottom once a photo finishes loading. */
  onImageLoad: () => void
}

function MessageRow({ message, onImageLoad }: MessageRowProps) {
  if (message.kind === 'system') {
    return (
      <Box
        sx={{
          alignSelf: 'center',
          maxWidth: '86%',
          px: '16px',
          py: '7px',
          borderRadius: 999,
          bgcolor: tokens.surfaceDim,
          fontSize: 13,
          fontWeight: 400,
          color: tokens.inkSecondary,
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        {message.text}
      </Box>
    )
  }

  if (message.authorId === 'you') {
    return (
      <Box
        sx={{
          alignSelf: 'flex-end',
          maxWidth: '75%',
          px: '16px',
          py: '11px',
          // design.md §6.16 user bubble: --user-bubble fill, radius 24.
          borderRadius: '24px 24px 4px 24px',
          bgcolor: tokens.userBubble,
          fontSize: 16,
          color: tokens.ink,
          lineHeight: 1.4,
        }}
      >
        {message.text}
      </Box>
    )
  }

  const p = participantById(message.authorId ?? '')
  return (
    <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', maxWidth: '85%' }}>
      <StrangerAvatar authorId={message.authorId ?? ''} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, color: tokens.inkSecondary, mb: '3px', ml: '4px' }}>
          {p?.name}
        </Typography>
        <Box
          sx={{
            px: '16px',
            py: '11px',
            borderRadius: '4px 20px 20px 20px',
            bgcolor: tokens.surfaceDim,
            fontSize: 16,
            color: tokens.ink,
            lineHeight: 1.4,
          }}
        >
          {message.text}
          {message.kind === 'photo' && message.photoUrl && (
            <Box
              component="img"
              src={message.photoUrl}
              alt="Photo from the front of the traffic jam"
              onLoad={onImageLoad}
              sx={{
                display: 'block',
                mt: '10px',
                width: 220,
                maxWidth: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                borderRadius: '14px',
                bgcolor: tokens.hairline,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

function TypingRow({ typing }: { typing: TypingState }) {
  return (
    <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
      <StrangerAvatar authorId={typing.authorId} />
      <Box
        sx={{
          px: '16px',
          py: '14px',
          borderRadius: '4px 20px 20px 20px',
          bgcolor: tokens.surfaceDim,
          display: 'flex',
          gap: '5px',
          '@keyframes typing-dot': {
            '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.45 },
            '30%': { transform: 'translateY(-4px)', opacity: 1 },
          },
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: tokens.inkSecondary,
              animation: `typing-dot 1200ms ease-in-out ${i * 160}ms infinite`,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

// The Google-created group chat for everyone stuck on the block. Stays
// mounted once the FAB has appeared — open/close only slides it, so
// messages, scroll position, and the draft survive close/reopen.
export function TrafficChatSheet({ open, messages, typing, onClose, onSend }: TrafficChatSheetProps) {
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  // Keep the newest message in view (scrollTop, not scrollIntoView, so the
  // surrounding app frame never scrolls).
  const scrollToBottom = () => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }
  useEffect(() => {
    if (open) scrollToBottom()
  }, [messages.length, typing, open])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
    setDraft('')
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '78%',
        zIndex: 8,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateY(0)' : 'translateY(105%)',
        transition: `transform 320ms ${MOTION_EMPHASIZED}`,
      }}
    >
      {/* Header */}
      <Box sx={{ pt: '10px', flexShrink: 0 }}>
        <Box sx={{ width: 36, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', px: '20px', py: '12px' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: tokens.teal,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ForumIcon sx={{ fontSize: 22, color: '#fff' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 19, fontWeight: 500, color: tokens.ink, lineHeight: 1.25 }}>
              {CHAT_TITLE}
            </Typography>
            <Typography noWrap sx={{ fontSize: 13.5, color: tokens.inkSecondary }}>
              {CHAT_SUBTITLE}
            </Typography>
          </Box>
          <Box
            onClick={onClose}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: tokens.surfaceDim,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <CloseIcon sx={{ fontSize: 20, color: tokens.ink }} />
          </Box>
        </Box>
        <Box sx={{ height: '1px', bgcolor: tokens.hairline }} />
      </Box>

      {/* Messages */}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          px: '16px',
          py: '16px',
        }}
      >
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} onImageLoad={scrollToBottom} />
        ))}
        {typing && <TypingRow typing={typing} />}
      </Box>

      {/* Composer */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', p: '10px 16px 16px' }}
      >
        <Box
          sx={{
            flex: 1,
            height: 52,
            borderRadius: 999,
            bgcolor: tokens.surfaceDim,
            display: 'flex',
            alignItems: 'center',
            px: '20px',
          }}
        >
          <InputBase
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSubmit(event)
            }}
            placeholder={CHAT_PLACEHOLDER}
            sx={{ flex: 1, fontSize: 16, color: tokens.ink }}
          />
        </Box>
        <ButtonBase
          type="submit"
          disabled={!draft.trim()}
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            flexShrink: 0,
            bgcolor: tokens.teal,
            opacity: draft.trim() ? 1 : 0.4,
            transition: 'opacity 150ms',
          }}
        >
          <ArrowUpwardIcon sx={{ fontSize: 22, color: '#fff' }} />
        </ButtonBase>
      </Box>
    </Box>
  )
}
