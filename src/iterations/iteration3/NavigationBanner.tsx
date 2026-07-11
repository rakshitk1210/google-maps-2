import { Box, IconButton, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import TurnLeftIcon from '@mui/icons-material/TurnLeft'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { BANNER_INSTRUCTION, CAFE_BANNER_INSTRUCTION } from './jamData'

interface NavigationBannerProps {
  joined: boolean
  toCafe: boolean
  onAiClick: () => void
}

export function NavigationBanner({ joined, toCafe, onAiClick }: NavigationBannerProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        bgcolor: '#0b6858',
        color: '#fff',
        borderRadius: '0 0 20px 20px',
        px: 2,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      {toCafe ? <TurnLeftIcon sx={{ fontSize: 32 }} /> : <ArrowUpwardIcon sx={{ fontSize: 32 }} />}
      <Typography sx={{ fontSize: 20, fontWeight: 500, flex: 1 }}>
        {toCafe ? CAFE_BANNER_INSTRUCTION : BANNER_INSTRUCTION}
      </Typography>
      {joined ? (
        <IconButton
          onClick={onAiClick}
          sx={{ width: 32, height: 32, bgcolor: '#a9d6cd', color: '#072d24', '&:hover': { bgcolor: '#a9d6cd' } }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 18 }} />
        </IconButton>
      ) : (
        <IconButton size="small" sx={{ bgcolor: '#fff', color: '#1a73e8' }}>
          <AutoAwesomeIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}
