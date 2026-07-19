import { Box, Button, Typography } from '@mui/material'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import geminiCircle from '../../../Gemini circle.png'
import { tokens } from './theme'

interface NavBottomBarProps {
  /** ETA duration for the current destination, e.g. "1 hr 55 min". */
  duration: string
  /** Gray meta line, e.g. "86 mi · 8:12 PM". */
  meta: string
  onExit: () => void
}

// Phone bottom bar, design.md §6.13: drag handle, Gemini spark circle, ETA in
// --green + leaf with gray meta line, destructive-tonal Exit pill. Flat (rule
// 0.10). The ETA re-reads the committed destination, so it updates in place
// after the jam matches and starts toward the restaurant.
export function NavBottomBar({ duration, meta, onExit }: NavBottomBarProps) {
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
        pt: '8px',
        pb: '18px',
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 4,
          borderRadius: 999,
          bgcolor: tokens.dragHandle,
          mx: 'auto',
          mb: '10px',
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', px: '20px' }}>
        <Box
          component="img"
          src={geminiCircle}
          alt="Ask Maps"
          sx={{
            width: 64,
            height: 64,
            flexShrink: 0,
            display: 'block',
          }}
        />

        <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <Typography sx={{ fontSize: 26, fontWeight: 600, color: tokens.green, lineHeight: 1.2 }}>
              {duration}
            </Typography>
            <EnergySavingsLeafIcon sx={{ fontSize: 17, color: tokens.green }} />
          </Box>
          <Typography
            noWrap
            sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1.25 }}
          >
            {meta}
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
