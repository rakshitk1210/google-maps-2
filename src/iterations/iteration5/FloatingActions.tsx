import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import SearchIcon from '@mui/icons-material/Search'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import NearMeIcon from '@mui/icons-material/NearMe'
import { tokens } from './theme'

interface FloatingActionsProps {
  showRecenter: boolean
}

// Right rail + re-center pill, design.md §6.13: 56px white circles 16px from
// the edge with 12px gaps; re-center pill bottom-left. Flat (rule 0.10).
export function FloatingActions({ showRecenter }: FloatingActionsProps) {
  const [muted, setMuted] = useState(false)

  const circleSx = {
    width: 56,
    height: 56,
    bgcolor: tokens.surface,
    boxShadow: tokens.shadowFloat,
    '&:hover': { bgcolor: tokens.surface },
  }

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          right: 16,
          top: '40%',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <IconButton aria-label="Recenter location" sx={circleSx}>
          <MyLocationIcon sx={{ fontSize: 24, color: tokens.blue }} />
        </IconButton>
        <IconButton aria-label="Search along route" sx={circleSx}>
          <SearchIcon sx={{ fontSize: 24, color: tokens.ink }} />
        </IconButton>
        <IconButton aria-label="Mute" onClick={() => setMuted((value) => !value)} sx={circleSx}>
          {muted ? (
            <VolumeOffIcon sx={{ fontSize: 24, color: tokens.red }} />
          ) : (
            <VolumeUpIcon sx={{ fontSize: 24, color: tokens.ink }} />
          )}
        </IconButton>
        <IconButton aria-label="Report" sx={circleSx}>
          <WarningRoundedIcon sx={{ fontSize: 24, color: tokens.amber }} />
        </IconButton>
      </Box>

      {showRecenter && (
        <Box
          sx={{
            position: 'absolute',
            left: 16,
            bottom: 140,
            zIndex: 4,
            height: 48,
            px: '20px',
            borderRadius: 999,
            bgcolor: tokens.surface,
            boxShadow: tokens.shadowFloat,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <NearMeIcon sx={{ fontSize: 20, color: tokens.teal }} />
          <Typography sx={{ fontSize: 17, fontWeight: 500, color: tokens.teal }}>Re-center</Typography>
        </Box>
      )}
    </>
  )
}
