import { Fab } from '@mui/material'
import LayersIcon from '@mui/icons-material/Layers'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import DirectionsIcon from '@mui/icons-material/Directions'

export function FloatingControls() {
  return (
    <>
      <Fab size="medium" sx={{ position: 'absolute', top: 210, right: 16, bgcolor: '#fff', zIndex: 1 }}>
        <LayersIcon />
      </Fab>
      <Fab
        size="medium"
        sx={{ position: 'absolute', bottom: 190, right: 16, bgcolor: '#fff', color: '#1a73e8', zIndex: 1 }}
      >
        <MyLocationIcon />
      </Fab>
      <Fab sx={{ position: 'absolute', bottom: 130, right: 16, bgcolor: '#0b6858', color: '#fff', zIndex: 1 }}>
        <DirectionsIcon />
      </Fab>
    </>
  )
}
