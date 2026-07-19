import { Box, Button, IconButton, Typography } from '@mui/material'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import geminiCircle from '../../../Gemini circle.png'
import {
  CAFE_TRIP_DISTANCE_ETA,
  CAFE_TRIP_DURATION,
  FULL_TRIP_DISTANCE_ETA,
  FULL_TRIP_DURATION,
} from './jamData'
import { tokens } from './theme'

interface PhoneNavSheetProps {
  toCafe: boolean
  onAiClick: () => void
}

// Bottom bar, design.md §6.13: white sheet radius 28 top, drag handle, row of
// Gemini spark circle · centered ETA 26/600 + leaf · Exit pill (6.7). Flat.
// The Gemini circle opens Ask Maps; the ETA follows the shared route target.
export function PhoneNavSheet({ toCafe, onAiClick }: PhoneNavSheetProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        pb: '24px',
      }}
    >
      <Box sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto', mt: '8px' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', px: '20px', pt: '12px', gap: '12px' }}>
        <IconButton
          aria-label="Ask Maps"
          onClick={onAiClick}
          sx={{
            width: 64,
            height: 64,
            flexShrink: 0,
            p: 0,
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          <Box
            component="img"
            src={geminiCircle}
            alt=""
            sx={{ width: 64, height: 64, display: 'block' }}
          />
        </IconButton>
        <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Typography sx={{ fontSize: 26, fontWeight: 600, color: tokens.green, lineHeight: 1.2 }}>
              {toCafe ? CAFE_TRIP_DURATION : FULL_TRIP_DURATION}
            </Typography>
            <EnergySavingsLeafIcon sx={{ fontSize: 16, color: tokens.green }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary }}>
            {toCafe ? CAFE_TRIP_DISTANCE_ETA : FULL_TRIP_DISTANCE_ETA}
          </Typography>
        </Box>
        <Button
          sx={{
            flexShrink: 0,
            height: 52,
            px: '24px',
            borderRadius: 999,
            bgcolor: tokens.redContainer,
            color: tokens.red,
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.redContainer },
          }}
        >
          Exit
        </Button>
      </Box>
    </Box>
  )
}
