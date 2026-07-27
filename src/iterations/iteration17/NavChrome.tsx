import { Box, Button, ButtonBase, IconButton, Typography } from '@mui/material'
import StraightIcon from '@mui/icons-material/Straight'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import NavigationIcon from '@mui/icons-material/Navigation'
import SearchIcon from '@mui/icons-material/Search'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import sparkWhite from '../iteration15/assets/spark-white.svg'
import { TRIP_TITLE, type NavState } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface NavChromeProps {
  nav: NavState
  /** Hidden while a sheet or the list owns the screen. */
  visible: boolean
  onOpenTrip: () => void
  onExit: () => void
}

/**
 * Everything floating over the drive: the teal instruction banner with the trip
 * chip hanging under it, the decorative map controls down the right edge, and
 * the ETA bar. The banner and ETA both read from `nav`, so committing the
 * detour to the café re-labels the drive in place rather than swapping screens.
 */
export function NavChrome({ nav, visible, onOpenTrip, onExit }: NavChromeProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: `opacity 240ms ${MOTION_EMPHASIZED}`,
        '& > *': { pointerEvents: visible ? 'auto' : 'none' },
      }}
    >
      {/* Instruction banner */}
      <Box sx={{ position: 'absolute', top: 58, left: 16, right: 16 }}>
        <Box
          sx={{
            bgcolor: tokens.tealBanner,
            borderRadius: '24px',
            p: '14px 14px 14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <StraightIcon sx={{ fontSize: 36, color: '#fff', flexShrink: 0 }} />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '7px', minWidth: 0, flex: 1 }}>
            <Typography
              sx={{ fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}
            >
              toward
            </Typography>
            {/* Sized to clear the spark circle — at 30px "11th Ave NE" ellipsed. */}
            <Typography
              noWrap
              sx={{
                fontSize: 26,
                fontWeight: 500,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-0.2px',
              }}
            >
              {nav.road}
            </Typography>
          </Box>
          {/* Ask Maps, per the Figma's blue circle on the banner */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: tokens.blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box component="img" src={sparkWhite} alt="" sx={{ width: 24, height: 24 }} />
          </Box>
        </Box>

        {/* Trip chip — the way into the list from inside the drive */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonBase
            onClick={onOpenTrip}
            aria-label={`Open ${TRIP_TITLE}`}
            sx={{
              mt: '-6px',
              px: '24px',
              py: '8px',
              gap: '6px',
              borderRadius: '999px',
              bgcolor: tokens.surface,
              boxShadow: tokens.shadowChrome,
              transition: `transform 160ms ${MOTION_EMPHASIZED}`,
              '&:active': { transform: 'scale(0.97)' },
            }}
          >
            <Typography sx={{ fontSize: 16, lineHeight: 1 }}>🍁</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.ink }}>
              {TRIP_TITLE}
            </Typography>
          </ButtonBase>
        </Box>
      </Box>

      {/* Decorative map controls */}
      <Box
        sx={{
          position: 'absolute',
          right: 16,
          top: 452,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <CircleControl label="Compass">
          <NavigationIcon sx={{ fontSize: 22, color: tokens.red }} />
        </CircleControl>
        <CircleControl label="Search along route">
          <SearchIcon sx={{ fontSize: 22, color: tokens.ink }} />
        </CircleControl>
        <CircleControl label="Mute guidance">
          <VolumeOffIcon sx={{ fontSize: 22, color: tokens.red }} />
        </CircleControl>
        <CircleControl label="Report incident">
          <ReportProblemIcon sx={{ fontSize: 22, color: tokens.amber }} />
        </CircleControl>
      </Box>

      {/* Re-center pill */}
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          bottom: 148,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          px: '16px',
          py: '10px',
          borderRadius: '999px',
          bgcolor: tokens.surface,
          boxShadow: tokens.shadowChrome,
        }}
      >
        <NavigationIcon sx={{ fontSize: 18, color: tokens.teal }} />
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.teal }}>Re-center</Typography>
      </Box>

      {/* ETA bar */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: tokens.surface,
          borderRadius: '28px 28px 0 0',
          pt: '8px',
          pb: '30px',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 4,
            borderRadius: 999,
            bgcolor: tokens.dragHandle,
            mx: 'auto',
            mb: '10px',
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', px: '20px' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Typography
                sx={{ fontSize: 26, fontWeight: 500, color: tokens.green, lineHeight: 1.2 }}
              >
                {nav.duration}
              </Typography>
              <EnergySavingsLeafIcon sx={{ fontSize: 18, color: tokens.green }} />
            </Box>
            <Typography
              noWrap
              sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1.3 }}
            >
              {nav.meta}
            </Typography>
          </Box>

          <IconButton
            aria-label="Route options"
            sx={{
              width: 52,
              height: 52,
              flexShrink: 0,
              bgcolor: tokens.surfaceDim,
              '&:hover': { bgcolor: tokens.surfaceDim },
            }}
          >
            <AltRouteIcon sx={{ fontSize: 24, color: tokens.ink }} />
          </IconButton>

          <Button
            onClick={onExit}
            sx={{
              flexShrink: 0,
              height: 52,
              px: '24px',
              borderRadius: 999,
              bgcolor: tokens.red,
              color: '#fff',
              fontSize: 17,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: tokens.red },
            }}
          >
            Exit
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

function CircleControl({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <IconButton
      aria-label={label}
      sx={{
        width: 48,
        height: 48,
        bgcolor: tokens.surface,
        boxShadow: tokens.shadowChrome,
        '&:hover': { bgcolor: tokens.surface },
      }}
    >
      {children}
    </IconButton>
  )
}
