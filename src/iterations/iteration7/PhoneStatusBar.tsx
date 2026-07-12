import { Box, Typography } from '@mui/material'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import WifiIcon from '@mui/icons-material/Wifi'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import { MODE_TRANSITION, useTokens } from './theme'

// iOS-style status bar (design.md §1: top ~54px overlay zone). Ink follows the
// active mode's palette so it re-tints with the Road Trip flush.
export function PhoneStatusBar() {
  const t = useTokens()
  const inkSx = { color: t.ink, transition: MODE_TRANSITION } as const
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        px: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 6,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, ...inkSx }}>9:41</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <SignalCellularAltIcon sx={{ fontSize: 17, ...inkSx }} />
        <WifiIcon sx={{ fontSize: 17, ...inkSx }} />
        <BatteryFullIcon sx={{ fontSize: 17, ...inkSx, transform: 'rotate(90deg)' }} />
      </Box>
    </Box>
  )
}
