import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CloseIcon from '@mui/icons-material/Close'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import TollIcon from '@mui/icons-material/Toll'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import { formatDistanceMiles, formatDuration, type MapsList } from './lists'

interface DriveSheetProps {
  list: MapsList
  routeInfo: { durationSec: number; distanceMeters: number } | null
  onClose: () => void
}

export function DriveSheet({ list, routeInfo, onClose }: DriveSheetProps) {
  const lastPlace = list.places[list.places.length - 1]
  const middleStopCount = Math.max(list.places.length - 1, 0)

  return (
    <>
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          top: 60,
          left: 16,
          right: 16,
          zIndex: 5,
          borderRadius: '16px',
          px: '16px',
          py: '14px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', py: '4px' }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#1a73e8',
              border: '2px solid #fff',
              boxShadow: '0 0 0 1px #ddd',
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: 14 }}>Your location</Typography>
        </Box>
        <Box sx={{ width: '2px', height: 14, bgcolor: '#ddd', ml: '5px' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', py: '4px' }}>
          <Box sx={{ color: '#888', display: 'flex' }}>
            <FiberManualRecordIcon sx={{ fontSize: 10 }} />
          </Box>
          <Typography sx={{ fontSize: 14 }}>
            {middleStopCount} stop{middleStopCount === 1 ? '' : 's'}
          </Typography>
        </Box>
        <Box sx={{ width: '2px', height: 14, bgcolor: '#ddd', ml: '5px' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', py: '4px' }}>
          <LocationOnIcon fontSize="small" sx={{ color: '#ea4335' }} />
          <Typography noWrap sx={{ fontSize: 14, flex: 1 }}>
            {lastPlace.name}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#eee' }}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Paper>

      <Paper
        elevation={8}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 70,
          top: '40%',
          zIndex: 5,
          borderRadius: '20px 20px 0 0',
          px: '20px',
          pt: '10px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ width: 36, height: 4, bgcolor: '#ccc', borderRadius: 999, mx: 'auto', mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: 30 }}>
            Drive
          </Typography>
          <IconButton sx={{ bgcolor: '#eee' }} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            mt: '20px',
            borderBottom: '1px solid #eee',
            pb: '12px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: 13,
              pb: '8px',
              borderBottom: '3px solid #0b6858',
              color: '#0b6858',
            }}
          >
            <DirectionsCarIcon />
            <Typography sx={{ fontSize: 13 }}>{routeInfo ? formatDuration(routeInfo.durationSec) : '—'}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: 13,
              pb: '8px',
              borderBottom: '3px solid transparent',
              color: '#666',
            }}
          >
            <DirectionsTransitIcon />
            <Typography sx={{ fontSize: 13 }}>—</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: 13,
              pb: '8px',
              borderBottom: '3px solid transparent',
              color: '#666',
            }}
          >
            <DirectionsWalkIcon />
            <Typography sx={{ fontSize: 13 }}>—</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: 13,
              pb: '8px',
              borderBottom: '3px solid transparent',
              color: '#666',
            }}
          >
            <DirectionsBikeIcon />
            <Typography sx={{ fontSize: 13 }}>—</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: 32, fontWeight: 700, color: '#0b6858', mt: '20px' }}>
          {routeInfo ? formatDuration(routeInfo.durationSec) : '—'}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, mt: '4px' }}>
          {routeInfo ? formatDistanceMiles(routeInfo.distanceMeters) : '—'} · Fastest route, the usual traffic
        </Typography>

        <Box sx={{ display: 'flex', gap: '8px', mt: '12px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              bgcolor: '#f1f3f4',
              borderRadius: 999,
              px: '10px',
              py: '6px',
              fontSize: 12,
              color: '#3c4043',
            }}
          >
            <TollIcon sx={{ fontSize: 16 }} />
            No tolls
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              bgcolor: '#f1f3f4',
              borderRadius: 999,
              px: '10px',
              py: '6px',
              fontSize: 12,
              color: '#3c4043',
            }}
          >
            <EnergySavingsLeafIcon sx={{ fontSize: 16 }} />
            Fuel-efficient
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '8px', mt: '20px', pb: '20px' }}>
          <Button variant="contained" sx={{ bgcolor: '#0b6858', borderRadius: 999, px: 2, fontWeight: 600 }}>
            Start
          </Button>
          <Button sx={{ bgcolor: '#a9d6cd', color: '#072d24', borderRadius: 999, px: 2, fontWeight: 600 }}>
            Add stops
          </Button>
          <Button sx={{ bgcolor: '#a9d6cd', color: '#072d24', borderRadius: 999, px: 2, fontWeight: 600 }}>
            Save
          </Button>
        </Box>
      </Paper>
    </>
  )
}
