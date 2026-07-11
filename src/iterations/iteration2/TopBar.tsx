import { Avatar, Box, Chip, IconButton, InputBase, Paper, Stack, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MicIcon from '@mui/icons-material/Mic'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SearchIcon from '@mui/icons-material/Search'

const CATEGORIES = ['Restaurants', 'Coffee', 'Gas', 'Hotels', 'Groceries', 'Parks']

interface TopBarProps {
  minimal?: boolean
}

export function TopBar({ minimal = false }: TopBarProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        p: '10px 16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0))',
        pointerEvents: 'none',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '2px' }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13 }}>3:45</Typography>
        <Typography sx={{ fontSize: 8, letterSpacing: 1 }}>●●●●</Typography>
      </Box>

      {!minimal && (
        <>
          <Paper
            elevation={3}
            sx={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: 999,
              px: '14px',
              py: '6px',
              color: '#444',
            }}
          >
            <LocationOnIcon sx={{ color: '#ea4335' }} fontSize="small" />
            <InputBase placeholder="Search here" readOnly sx={{ flex: 1, fontSize: 16, color: '#5f6368' }} />
            <IconButton size="small">
              <MicIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#f1f3f4', color: '#5f6368' }}>
              <AccountCircleIcon fontSize="small" />
            </Avatar>
          </Paper>

          <Stack
            direction="row"
            spacing={1}
            sx={{ pointerEvents: 'auto', overflowX: 'auto', pb: '4px', '&::-webkit-scrollbar': { display: 'none' } }}
          >
            <Chip
              icon={<SearchIcon fontSize="small" sx={{ color: '#1a73e8 !important' }} />}
              label="Ask Maps"
              variant="outlined"
              sx={{
                bgcolor: '#fff',
                color: '#1a73e8',
                borderColor: '#1a73e8',
                fontWeight: 600,
                flexShrink: 0,
              }}
            />
            {CATEGORIES.map((category) => (
              <Chip key={category} label={category} sx={{ bgcolor: '#fff', fontWeight: 500, flexShrink: 0 }} />
            ))}
          </Stack>
        </>
      )}
    </Box>
  )
}
