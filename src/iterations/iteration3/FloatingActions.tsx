import { useState } from 'react'
import { Fab } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import SearchIcon from '@mui/icons-material/Search'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import NearMeIcon from '@mui/icons-material/NearMe'

interface FloatingActionsProps {
  showRecenter: boolean
}

export function FloatingActions({ showRecenter }: FloatingActionsProps) {
  const [muted, setMuted] = useState(false)

  return (
    <>
      <Fab size="medium" sx={{ position: 'absolute', top: 100, right: 16, bgcolor: '#fff', color: '#1a73e8', zIndex: 1 }}>
        <MyLocationIcon />
      </Fab>
      <Fab size="medium" sx={{ position: 'absolute', top: 160, right: 16, bgcolor: '#fff', zIndex: 1 }}>
        <SearchIcon />
      </Fab>
      <Fab
        size="medium"
        onClick={() => setMuted((prev) => !prev)}
        sx={{ position: 'absolute', top: 220, right: 16, bgcolor: '#fff', zIndex: 1 }}
      >
        {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </Fab>
      <Fab size="medium" sx={{ position: 'absolute', top: 280, right: 16, bgcolor: '#fff', color: '#d93025', zIndex: 1 }}>
        <ReportProblemIcon />
      </Fab>

      {showRecenter && (
        <Fab
          variant="extended"
          size="medium"
          sx={{ position: 'absolute', bottom: 220, left: 16, bgcolor: '#fff', color: '#1a73e8', zIndex: 1, gap: 1 }}
        >
          <NearMeIcon fontSize="small" />
          Re-center
        </Fab>
      )}
    </>
  )
}
