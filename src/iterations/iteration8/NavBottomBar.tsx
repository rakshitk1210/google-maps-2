import { Box, Button, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import { TRIP_DURATION, TRIP_META } from './navData'
import { tokens } from './theme'

// Phone bottom bar, design.md §6.13: drag handle, Gemini spark circle,
// ETA in --green + leaf with gray meta line, destructive-tonal Exit pill.
// Flat (rule 0.10). Everything but the layout is decorative in this demo.
export function NavBottomBar() {
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
              {TRIP_DURATION}
            </Typography>
            <EnergySavingsLeafIcon sx={{ fontSize: 17, color: tokens.green }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1.25 }}>
            {TRIP_META}
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
