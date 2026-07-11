import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import SearchIcon from '@mui/icons-material/Search'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import { JOINED_COUNT } from './jamData'
import { tokens } from './theme'
import type { JamFlow } from './jamData'

interface CarPlayRailProps {
  jamFlow: JamFlow
  onInvite: () => void
}

// Right rail, design.md §6.13 scaled for CarPlay: 44px white circles, 12px
// gaps, flat (rule 0.10). Person-add sits on top — the Jam entry point.
export function CarPlayRail({ jamFlow, onInvite }: CarPlayRailProps) {
  const [muted, setMuted] = useState(false)
  const joined = jamFlow === 'joined'

  const circleSx = {
    width: 44,
    height: 44,
    bgcolor: tokens.surface,
    boxShadow: tokens.shadowFloat,
    '&:hover': { bgcolor: tokens.surface },
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 12,
        top: 76,
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          aria-label={joined ? `${JOINED_COUNT} people have accepted` : 'Add people to Jam'}
          onClick={jamFlow === 'idle' ? onInvite : undefined}
          sx={{
            ...circleSx,
            ...(jamFlow === 'inviteSent' && {
              animation: 'invite-pulse 900ms ease-in-out infinite',
              '@keyframes invite-pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.45 },
                '100%': { opacity: 1 },
              },
            }),
          }}
        >
          <PersonAddAlt1Icon sx={{ fontSize: 22, color: tokens.teal }} />
        </IconButton>
        {joined && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: tokens.green,
              border: `2px solid ${tokens.surface}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: tokens.surface, lineHeight: 1 }}>
              {JOINED_COUNT}
            </Typography>
          </Box>
        )}
      </Box>

      <IconButton aria-label="Search along route" sx={circleSx}>
        <SearchIcon sx={{ fontSize: 22, color: tokens.ink }} />
      </IconButton>
      <IconButton aria-label="Mute" onClick={() => setMuted((value) => !value)} sx={circleSx}>
        {muted ? (
          <VolumeOffIcon sx={{ fontSize: 22, color: tokens.red }} />
        ) : (
          <VolumeUpIcon sx={{ fontSize: 22, color: tokens.ink }} />
        )}
      </IconButton>
      <IconButton aria-label="Report" sx={circleSx}>
        <WarningRoundedIcon sx={{ fontSize: 22, color: tokens.amber }} />
      </IconButton>
    </Box>
  )
}
