import { Box, Button, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import { tokens } from './theme'

interface NavBottomBarProps {
  /** ETA duration for the current destination, e.g. "47 min". */
  duration: string
  /** Gray meta line, e.g. "18 mi · 5:55 PM". */
  meta: string
  onExit: () => void
}

// Phone bottom bar, design.md §6.13 (iteration 8's bar with live props): drag
// handle, Gemini spark circle, ETA in --green + leaf with gray meta line,
// destructive-tonal Exit pill. Flat (rule 0.10). The ETA re-reads the selected
// place, so switching destinations mid-drive updates it in place.
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
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            flexShrink: 0,
            bgcolor: tokens.surface,
            border: `1px solid ${tokens.hairline}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 26, color: tokens.blue }} />
        </Box>

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
