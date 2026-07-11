import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { PhoneIdleScreen } from './PhoneIdleScreen'
import { PhoneNavMap } from './PhoneNavMap'
import { PhoneNavBanner } from './PhoneNavBanner'
import { PhoneNavSheet } from './PhoneNavSheet'
import { PhoneStatusBar } from './PhoneStatusBar'
import { JamNotification } from './JamNotification'
import { JamJoinedCard } from './JamJoinedCard'
import { PhoneAiSheet } from './PhoneAiSheet'
import { PhoneCafeSheet } from './PhoneCafeSheet'
import { PhoneSendToCarSheet } from './PhoneSendToCarSheet'
import { DeviceGlow } from './DeviceGlow'
import { MOTION_EMPHASIZED, tokens } from './theme'
import { CAFES } from './jamData'
import type { JamFlow, RouteTarget } from './jamData'

interface PhoneScreenProps {
  jamFlow: JamFlow
  routeTarget: RouteTarget
  onJoin: () => void
  onDismiss: () => void
  onRouteToCafe: () => void
}

type AiView = { screen: 'none' } | { screen: 'chat' } | { screen: 'cafe'; cafeId: string }

type SendState = 'idle' | 'sending' | 'sent'

// The invitee's phone. The outer screen is 320×694 to sit beside the CarPlay
// unit. Overlay UI (home, notification, banner, sheets) is authored at the
// design.md reference viewport (402×872) and uniformly scaled down, so every
// spec value applies literally. The live navigation map, however, renders as
// a separate base layer at native size — a CSS-scaled Mapbox canvas would
// blur tiles and break pointer math.
const CONTENT_WIDTH = 402
const CONTENT_HEIGHT = 872
const SCREEN_WIDTH = 320
const PHONE_SCALE = SCREEN_WIDTH / CONTENT_WIDTH
const SCREEN_HEIGHT = Math.round(CONTENT_HEIGHT * PHONE_SCALE)

// How long the "You've joined" confirmation stays up before it gives way to
// the live turn-by-turn banner.
const JOINED_TOAST_MS = 3500
// How long the "sent to car" confirmation lingers before the sheet closes.
const SENT_CONFIRM_MS = 2500

export function PhoneScreen({ jamFlow, routeTarget, onJoin, onDismiss, onRouteToCafe }: PhoneScreenProps) {
  const joined = jamFlow === 'joined'
  const toCafe = routeTarget === 'cafe'
  const [showJoinedToast, setShowJoinedToast] = useState(false)
  const [aiView, setAiView] = useState<AiView>({ screen: 'none' })
  const [aiTyped, setAiTyped] = useState(false)
  const [sendState, setSendState] = useState<SendState>('idle')

  useEffect(() => {
    if (!joined) {
      setShowJoinedToast(false)
      setAiView({ screen: 'none' })
      setSendState('idle')
      return
    }
    setShowJoinedToast(true)
    const timer = setTimeout(() => setShowJoinedToast(false), JOINED_TOAST_MS)
    return () => clearTimeout(timer)
  }, [joined])

  useEffect(() => {
    if (sendState !== 'sent') return
    const timer = setTimeout(() => setSendState('idle'), SENT_CONFIRM_MS)
    return () => clearTimeout(timer)
  }, [sendState])

  const activeCafe = aiView.screen === 'cafe' ? CAFES.find((cafe) => cafe.id === aiView.cafeId) : undefined

  return (
    <Box
      sx={{
        p: '8px',
        bgcolor: tokens.carPlayBezel,
        borderRadius: '32px',
        boxShadow: joined ? `${tokens.shadowDevice}, ${tokens.outerGlow}` : tokens.shadowDevice,
        transition: `box-shadow 360ms ${MOTION_EMPHASIZED}`,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          borderRadius: '24px',
          overflow: 'hidden',
          bgcolor: tokens.mapLand,
        }}
      >
        {/* Base layer: live shared navigation map, native size (crisp) */}
        {joined && <PhoneNavMap routeTarget={routeTarget} />}

        {/* Overlay chrome, authored at 402×872 and scaled to fit */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: CONTENT_WIDTH,
            height: CONTENT_HEIGHT,
            transform: `scale(${PHONE_SCALE})`,
            transformOrigin: 'top left',
          }}
        >
          {joined ? (
            <>
              <PhoneStatusBar />
              {showJoinedToast ? <JamJoinedCard /> : <PhoneNavBanner toCafe={toCafe} />}
              <PhoneNavSheet toCafe={toCafe} onAiClick={() => setAiView({ screen: 'chat' })} />

              {aiView.screen === 'chat' && (
                <PhoneAiSheet
                  skipAnimation={aiTyped}
                  onOpenCafe={(cafeId) => {
                    setAiTyped(true)
                    setAiView({ screen: 'cafe', cafeId })
                  }}
                  onClose={() => setAiView({ screen: 'none' })}
                />
              )}

              {activeCafe && (
                <PhoneCafeSheet
                  cafe={activeCafe}
                  onClose={() => setAiView({ screen: 'chat' })}
                  onSendToCar={() => {
                    setAiView({ screen: 'none' })
                    setSendState('sending')
                  }}
                />
              )}

              {sendState !== 'idle' && (
                <PhoneSendToCarSheet
                  phase={sendState}
                  onCancel={() => setSendState('idle')}
                  onComplete={() => {
                    setSendState('sent')
                    onRouteToCafe()
                  }}
                />
              )}
            </>
          ) : (
            <PhoneIdleScreen />
          )}

          {jamFlow === 'notified' && <JamNotification onJoin={onJoin} onDismiss={onDismiss} />}
        </Box>

        <DeviceGlow active={joined} />
      </Box>
    </Box>
  )
}
