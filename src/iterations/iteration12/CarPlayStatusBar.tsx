import { Box, Typography } from '@mui/material'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'
import PlaceIcon from '@mui/icons-material/Place'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PhoneIcon from '@mui/icons-material/Phone'
import AppsIcon from '@mui/icons-material/Apps'
import { CARPLAY_CLOCK } from './data'
import { tokens } from './theme'

const appIconSx = {
  width: 38,
  height: 38,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const

// CarPlay system column: clock + status glyphs on top, app icons below,
// app-grid shortcut at the bottom (mirrors the reference screenshot).
export function CarPlayStatusBar() {
  return (
    <Box
      sx={{
        width: 64,
        flexShrink: 0,
        bgcolor: tokens.carPlayStatusBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: '12px',
        pb: '12px',
      }}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: tokens.surface, lineHeight: 1 }}>
        {CARPLAY_CLOCK}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', mt: '6px' }}>
        <SignalCellularAltIcon sx={{ fontSize: 13, color: tokens.inkSecondary }} />
        <BatteryChargingFullIcon sx={{ fontSize: 13, color: tokens.green, transform: 'rotate(90deg)' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: '22px' }}>
        <Box sx={{ ...appIconSx, bgcolor: tokens.surface }}>
          <PlaceIcon sx={{ fontSize: 22, color: tokens.teal }} />
        </Box>
        <Box sx={{ ...appIconSx, bgcolor: tokens.red }}>
          <PlayArrowIcon sx={{ fontSize: 24, color: tokens.surface }} />
        </Box>
        <Box sx={{ ...appIconSx, bgcolor: tokens.green }}>
          <PhoneIcon sx={{ fontSize: 20, color: tokens.surface }} />
        </Box>
      </Box>

      <AppsIcon sx={{ fontSize: 22, color: tokens.inkSecondary, mt: 'auto' }} />
    </Box>
  )
}
