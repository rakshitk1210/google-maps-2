import { useEffect, useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { MapCanvas } from './MapCanvas'
import { NavigationBanner } from './NavigationBanner'
import { NavigationSheet } from './NavigationSheet'
import { JamInviteSheet } from './JamInviteSheet'
import { FloatingActions } from './FloatingActions'
import { AskAiSheet } from './AskAiSheet'
import { CafeDetailSheet } from './CafeDetailSheet'
import { SendToCarSheet } from './SendToCarSheet'
import { theme } from './theme'
import { CAFES, CAR_POSITION } from './jamData'

type JamState = 'none' | 'invite' | 'joined'

type AiView = { screen: 'none' } | { screen: 'chat' } | { screen: 'cafe'; cafeId: string }

type SendState = 'idle' | 'sending' | 'sent'

export function GoogleMapsClone() {
  const [jamState, setJamState] = useState<JamState>('none')
  const [aiView, setAiView] = useState<AiView>({ screen: 'none' })
  const [sendState, setSendState] = useState<SendState>('idle')
  const [routeTarget, setRouteTarget] = useState<'destination' | 'cafe'>('destination')
  const [aiTyped, setAiTyped] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setJamState('invite'), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (sendState !== 'sent') return
    const timer = setTimeout(() => setSendState('idle'), 2500)
    return () => clearTimeout(timer)
  }, [sendState])

  const joined = jamState === 'joined'
  const activeCafeIndex = aiView.screen === 'cafe' ? CAFES.findIndex((cafe) => cafe.id === aiView.cafeId) : -1
  const activeCafe = activeCafeIndex >= 0 ? CAFES[activeCafeIndex] : undefined

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 'inherit',
          bgcolor: '#e8eaed',
        }}
      >
        <MapCanvas center={CAR_POSITION} zoom={18} joined={joined} routeTarget={routeTarget} />

        <NavigationBanner joined={joined} toCafe={routeTarget === 'cafe'} onAiClick={() => setAiView({ screen: 'chat' })} />

        <FloatingActions showRecenter={!joined} />

        <NavigationSheet active={joined} toCafe={routeTarget === 'cafe'} onExit={() => {}} />

        {jamState === 'invite' && (
          <JamInviteSheet onJoin={() => setJamState('joined')} onDismiss={() => setJamState('none')} />
        )}

        {joined && aiView.screen === 'chat' && (
          <AskAiSheet
            skipAnimation={aiTyped}
            onOpenCafe={(cafeId) => {
              setAiTyped(true)
              setAiView({ screen: 'cafe', cafeId })
            }}
            onClose={() => setAiView({ screen: 'none' })}
          />
        )}

        {joined && activeCafe && (
          <CafeDetailSheet
            cafe={activeCafe}
            cafeIndex={activeCafeIndex}
            onClose={() => setAiView({ screen: 'chat' })}
            onSendToCar={() => {
              setAiView({ screen: 'none' })
              setSendState('sending')
            }}
          />
        )}

        {sendState !== 'idle' && (
          <SendToCarSheet
            phase={sendState}
            onCancel={() => setSendState('idle')}
            onComplete={() => {
              setSendState('sent')
              setRouteTarget('cafe')
            }}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
