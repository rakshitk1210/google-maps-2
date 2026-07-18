import { useEffect, useRef, useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { NavMapCanvas } from './NavMapCanvas'
import { PhoneStatusBar } from './PhoneStatusBar'
import { NavBanner } from './NavBanner'
import { NavRail } from './NavRail'
import { RecenterPill } from './RecenterPill'
import { NavBottomBar } from './NavBottomBar'
import { TrafficChatSheet } from './TrafficChatSheet'
import { useChatEngine } from './useChatEngine'
import { CHAT_FAB_DELAY_MS } from './navData'
import { theme, tokens } from './theme'

// Iteration 8 — stuck in traffic on the way to 11th Ave NE. Phone-only
// active-nav view (design.md §6.13). After a beat, Google "realizes" the
// whole block is stuck and surfaces a chat FAB on the left; tapping it opens
// the group chat it created for the drivers in the jam. The sheet stays
// mounted once revealed, so closing it never loses the conversation.
export function GoogleMapsClone() {
  const [fabVisible, setFabVisible] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const recenterRef = useRef<(() => void) | null>(null)
  const { messages, typing, unreadCount, sendMessage, markRead } = useChatEngine(fabVisible, chatOpen)

  useEffect(() => {
    const id = window.setTimeout(() => setFabVisible(true), CHAT_FAB_DELAY_MS)
    return () => clearTimeout(id)
  }, [])

  const handleOpenChat = () => {
    setChatOpen(true)
    markRead()
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', bgcolor: tokens.mapLand }}>
        <NavMapCanvas recenterRef={recenterRef} />
        <PhoneStatusBar />
        <NavBanner />
        <NavRail chatVisible={fabVisible} unreadCount={unreadCount} onChatClick={handleOpenChat} />
        <RecenterPill onClick={() => recenterRef.current?.()} />
        <NavBottomBar />
        {fabVisible && (
          <TrafficChatSheet
            open={chatOpen}
            messages={messages}
            typing={typing}
            onClose={() => setChatOpen(false)}
            onSend={sendMessage}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
