import { useEffect, useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { CarPlayScreen } from './CarPlayScreen'
import { PhoneScreen } from './PhoneScreen'
import { theme } from './theme'
import type { JamFlow, RouteTarget } from './jamData'

// Iteration 6 renders its own dual-device stage (CarPlay head unit + phone)
// instead of the shared 402×872 .phone-frame — PhoneFrame early-returns here.
export function GoogleMapsClone() {
  const [jamFlow, setJamFlow] = useState<JamFlow>('idle')
  // Shared across both devices: sending a cafe from the phone re-routes the
  // car (and the phone's mirror) from Mount Rainier to Cafe Ladro.
  const [routeTarget, setRouteTarget] = useState<RouteTarget>('destination')

  // The invite "travels" from the car to the phone: brief sending window
  // before the notification lands (same timer pattern as iteration 5).
  useEffect(() => {
    if (jamFlow !== 'inviteSent') return
    const timer = setTimeout(() => setJamFlow('notified'), 900)
    return () => clearTimeout(timer)
  }, [jamFlow])

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
        <CarPlayScreen
          jamFlow={jamFlow}
          routeTarget={routeTarget}
          onInvite={() => setJamFlow('inviteSent')}
        />
        <PhoneScreen
          jamFlow={jamFlow}
          routeTarget={routeTarget}
          onJoin={() => setJamFlow('joined')}
          onDismiss={() => setJamFlow('idle')}
          onRouteToCafe={() => setRouteTarget('cafe')}
        />
      </Box>
    </ThemeProvider>
  )
}
