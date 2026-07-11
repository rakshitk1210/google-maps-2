import { Box, Typography } from '@mui/material'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import WifiIcon from '@mui/icons-material/Wifi'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import { PHONE_CLOCK } from './jamData'
import { tokens } from './theme'

// iOS-style status bar (design.md §1: top ~54px overlay zone). Shared by the
// phone's idle home and its navigation view.
export function PhoneStatusBar() {
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
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: tokens.ink }}>{PHONE_CLOCK}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <SignalCellularAltIcon sx={{ fontSize: 17, color: tokens.ink }} />
        <WifiIcon sx={{ fontSize: 17, color: tokens.ink }} />
        <BatteryFullIcon sx={{ fontSize: 17, color: tokens.ink, transform: 'rotate(90deg)' }} />
      </Box>
    </Box>
  )
}
