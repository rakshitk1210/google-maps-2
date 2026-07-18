import { Box, Typography } from '@mui/material'
import NavigationIcon from '@mui/icons-material/Navigation'
import { tokens } from './theme'

interface RecenterPillProps {
  onClick: () => void
}

// "Re-center" pill above the bottom bar (design.md §6.13). Flat white pill,
// teal icon + label, radius 999 per rule 0.2.
export function RecenterPill({ onClick }: RecenterPillProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: 16,
        bottom: 118,
        zIndex: 4,
        height: 48,
        px: '18px',
        borderRadius: 999,
        bgcolor: tokens.surface,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: tokens.shadowFloat,
        cursor: 'pointer',
      }}
    >
      <NavigationIcon sx={{ fontSize: 20, color: tokens.teal }} />
      <Typography sx={{ fontSize: 17, fontWeight: 500, color: tokens.teal }}>Re-center</Typography>
    </Box>
  )
}
