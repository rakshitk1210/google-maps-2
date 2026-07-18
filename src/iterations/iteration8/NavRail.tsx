import { useState } from 'react'
import { Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ForumIcon from '@mui/icons-material/Forum'
import { MOTION_EMPHASIZED, tokens } from './theme'

const CIRCLE = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  bgcolor: tokens.surface,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: tokens.shadowFloat,
  cursor: 'pointer',
} as const

// Red/gray compass needle, matching Google's nav compass.
function CompassNeedle() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L15.2 12 L8.8 12 Z" fill={tokens.compassNorth} />
      <path d="M12 22 L8.8 12 L15.2 12 Z" fill={tokens.compassSouth} />
    </svg>
  )
}

interface NavRailProps {
  /** Chat surfaces after Google notices the whole block is stuck. */
  chatVisible: boolean
  unreadCount: number
  onChatClick: () => void
}

// Right-hand rail of nav controls, design.md §6.13: 56px flat white circles,
// 12px apart, 16px off the right edge, starting below the banner. The chat
// control joins the bottom of the rail once Google surfaces it (popping in
// with a scale-up + attention pulse and a red unread badge). Only mute and
// chat are live — the rest are decorative for this demo.
export function NavRail({ chatVisible, unreadCount, onChatClick }: NavRailProps) {
  const [muted, setMuted] = useState(true)

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 16,
        top: '36%',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Box sx={CIRCLE}>
        <CompassNeedle />
      </Box>
      <Box sx={CIRCLE}>
        <SearchIcon sx={{ fontSize: 26, color: tokens.ink }} />
      </Box>
      <Box sx={CIRCLE} onClick={() => setMuted((v) => !v)}>
        {muted ? (
          <VolumeOffIcon sx={{ fontSize: 26, color: tokens.red }} />
        ) : (
          <VolumeUpIcon sx={{ fontSize: 26, color: tokens.ink }} />
        )}
      </Box>
      <Box sx={CIRCLE}>
        <AltRouteIcon sx={{ fontSize: 26, color: tokens.ink }} />
      </Box>
      <Box sx={CIRCLE}>
        <WarningRoundedIcon sx={{ fontSize: 28, color: tokens.amber }} />
      </Box>

      {chatVisible && (
        <Box
          onClick={onChatClick}
          sx={{
            position: 'relative',
            width: 56,
            height: 56,
            cursor: 'pointer',
            animation: `chat-rail-in 420ms ${MOTION_EMPHASIZED} both`,
            '@keyframes chat-rail-in': {
              from: { transform: 'scale(0)', opacity: 0 },
              '70%': { transform: 'scale(1.08)', opacity: 1 },
              to: { transform: 'scale(1)', opacity: 1 },
            },
          }}
        >
          {/* Two-cycle halo pulse right after the pop-in */}
          <Box
            sx={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              bgcolor: 'rgba(13, 92, 99, 0.22)',
              animation: 'chat-rail-ping 1100ms ease-out 480ms 2 both',
              '@keyframes chat-rail-ping': {
                from: { transform: 'scale(0.7)', opacity: 0.7 },
                to: { transform: 'scale(1.45)', opacity: 0 },
              },
            }}
          />
          <Box sx={{ ...CIRCLE, position: 'absolute', inset: 0 }}>
            <ForumIcon sx={{ fontSize: 26, color: tokens.teal }} />
          </Box>
          {unreadCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -3,
                right: -5,
                minWidth: 20,
                height: 20,
                px: '5px',
                boxSizing: 'border-box',
                borderRadius: 999,
                bgcolor: tokens.red,
                border: '2px solid #fff',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
