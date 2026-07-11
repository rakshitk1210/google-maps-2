import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import {
  FULL_TRIP_DISTANCE_ETA,
  FULL_TRIP_DURATION,
  NEAREST_CAFE_DISTANCE_ETA,
  NEAREST_CAFE_DURATION,
} from './jamData'

interface NavigationSheetProps {
  active: boolean
  toCafe: boolean
  onExit: () => void
}

export function NavigationSheet({ active, toCafe, onExit }: NavigationSheetProps) {
  if (!active) {
    return (
      <Paper
        elevation={8}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          borderRadius: '16px 16px 0 0',
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ width: 36, height: 4, bgcolor: '#ccc', borderRadius: 999, mx: 'auto', mb: 1 }} />
        <Typography sx={{ fontSize: 13, color: 'text.secondary', textAlign: 'center' }}>details</Typography>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        borderRadius: '20px 20px 0 0',
        px: 2,
        py: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 700, color: '#0b6858' }}>
            {toCafe ? NEAREST_CAFE_DURATION : FULL_TRIP_DURATION}
          </Typography>
          <EnergySavingsLeafIcon sx={{ fontSize: 18, color: '#0b6858' }} />
        </Box>
        <IconButton size="small" sx={{ bgcolor: '#f1f3f4' }}>
          <AltRouteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          {toCafe ? NEAREST_CAFE_DISTANCE_ETA : FULL_TRIP_DISTANCE_ETA}
        </Typography>
        <Button
          variant="contained"
          onClick={onExit}
          sx={{ bgcolor: '#d93025', color: '#fff', borderRadius: 999, px: 3, fontWeight: 600 }}
        >
          Exit
        </Button>
      </Box>
    </Paper>
  )
}
