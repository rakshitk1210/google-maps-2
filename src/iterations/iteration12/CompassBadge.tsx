import { Box, Typography } from '@mui/material'
import NearMeIcon from '@mui/icons-material/NearMe'
import { COMPASS_LABEL } from './data'
import { tokens } from './theme'

// Compass, design.md §6.13 right-rail compass promoted to the top-right badge
// position per the CarPlay reference: white circle, red needle over "SW".
export function CompassBadge() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 5,
        width: 44,
        height: 44,
        borderRadius: '50%',
        bgcolor: tokens.surface,
        border: `1px solid ${tokens.hairline}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: tokens.shadowFloat,
      }}
    >
      <NearMeIcon sx={{ fontSize: 12, color: tokens.red }} />
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.ink, lineHeight: 1.1 }}>
        {COMPASS_LABEL}
      </Typography>
    </Box>
  )
}
