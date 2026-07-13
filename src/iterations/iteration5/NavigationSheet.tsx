import { Box, Button, IconButton, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import {
  FULL_TRIP_DISTANCE_ETA,
  FULL_TRIP_DURATION,
  NEAREST_CAFE_DISTANCE_ETA,
  NEAREST_CAFE_DURATION,
} from './jamData'
import { tokens } from './theme'

interface NavigationSheetProps {
  active: boolean
  toCafe: boolean
  onExit: () => void
  onAiClick: () => void
}

const sheetSx = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 5,
  bgcolor: tokens.surface,
  borderRadius: '28px 28px 0 0',
  boxShadow: tokens.shadowSheet,
}

const dragHandleSx = {
  width: 40,
  height: 4,
  bgcolor: tokens.dragHandle,
  borderRadius: '2px',
  mx: 'auto',
  mt: '8px',
}

// Bottom bar, design.md §6.13: white sheet radius 28 top, drag handle, row of
// Gemini spark circle (opens Ask Maps) · centered ETA 26/600 + leaf · Exit.
export function NavigationSheet({ active, toCafe, onExit, onAiClick }: NavigationSheetProps) {
  if (!active) {
    return (
      <Box sx={{ ...sheetSx, pb: '24px' }}>
        <Box sx={dragHandleSx} />
        <Typography
          sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, textAlign: 'center', pt: '12px' }}
        >
          Details
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ ...sheetSx, pb: '24px' }}>
      <Box sx={dragHandleSx} />
      <Box sx={{ display: 'flex', alignItems: 'center', px: '20px', pt: '12px', gap: '12px' }}>
        <IconButton
          aria-label="Ask Maps"
          onClick={onAiClick}
          sx={{
            width: 56,
            height: 56,
            flexShrink: 0,
            bgcolor: tokens.surface,
            border: `1px solid ${tokens.hairline}`,
            '&:hover': { bgcolor: tokens.surface },
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 26, color: tokens.blue }} />
        </IconButton>
        <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Typography sx={{ fontSize: 26, fontWeight: 600, color: tokens.green, lineHeight: 1.2 }}>
              {toCafe ? NEAREST_CAFE_DURATION : FULL_TRIP_DURATION}
            </Typography>
            <EnergySavingsLeafIcon sx={{ fontSize: 16, color: tokens.green }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary }}>
            {toCafe ? NEAREST_CAFE_DISTANCE_ETA : FULL_TRIP_DISTANCE_ETA}
          </Typography>
        </Box>
        <Button
          onClick={onExit}
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
