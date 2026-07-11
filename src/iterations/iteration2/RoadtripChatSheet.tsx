import { Box, Fade, IconButton, Paper, TextField, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import HistoryIcon from '@mui/icons-material/History'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import DirectionsIcon from '@mui/icons-material/Directions'
import MicIcon from '@mui/icons-material/Mic'
import { formatDuration, type MapsList } from './lists'

interface RoadtripChatSheetProps {
  list: MapsList
  routeInfo: { durationSec: number; distanceMeters: number } | null
  onViewRoute: () => void
  onClose: () => void
}

export function RoadtripChatSheet({ list, routeInfo, onViewRoute, onClose }: RoadtripChatSheetProps) {
  const firstPlace = list.places[0]
  const lastPlace = list.places[list.places.length - 1]
  const stopCount = list.places.length

  return (
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a73e8' }}>
          <AutoAwesomeIcon />
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Ask Maps</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <IconButton sx={{ bgcolor: '#eee' }}>
            <HistoryIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ bgcolor: '#eee' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ bgcolor: '#eee' }} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mt: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box
          sx={{
            alignSelf: 'flex-end',
            bgcolor: '#eee',
            color: '#202124',
            borderRadius: '18px',
            px: '16px',
            py: '10px',
            maxWidth: '80%',
            fontSize: 15,
          }}
        >
          Plan a road trip for {list.name}
        </Box>

        <Fade in timeout={200}>
          <Typography sx={{ fontSize: 15, lineHeight: 1.5 }}>
            {stopCount === 1
              ? `A road trip to ${firstPlace.name} — add more places to map out a full route.`
              : `A road trip through ${list.name} takes you from ${firstPlace.name} to ${lastPlace.name}, covering ${stopCount} stops along the way.`}
          </Typography>
        </Fade>

        {routeInfo && (
          <Fade in timeout={200}>
            <Box
              component="button"
              onClick={onViewRoute}
              sx={{
                textAlign: 'left',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                bgcolor: '#f1f3f4',
                borderRadius: '14px',
                px: '14px',
                py: '12px',
                font: 'inherit',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: '#a9d6cd',
                  color: '#072d24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <DirectionsIcon fontSize="small" />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {formatDuration(routeInfo.durationSec)} · {firstPlace.name} to {lastPlace.name} · {stopCount} stops
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>

      <Box
        sx={{
          mt: 'auto',
          mb: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          bgcolor: '#eee',
          borderRadius: 999,
          pl: '14px',
          pr: '6px',
          py: '6px',
        }}
      >
        <TextField
          placeholder="Ask a question"
          variant="standard"
          slotProps={{ input: { disableUnderline: true, readOnly: true } }}
          sx={{ flex: 1 }}
        />
        <IconButton sx={{ bgcolor: '#fff' }}>
          <MicIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  )
}
