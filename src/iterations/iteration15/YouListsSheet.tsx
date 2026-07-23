import { Box, ButtonBase, Typography } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { MOTION_EMPHASIZED, tokens } from './theme'
import { YOU_LISTS, type YouList } from './tripData'

interface YouListsSheetProps {
  /** Opens the Skagit road-trip itinerary (the one live row). */
  onOpenSkagit: () => void
}

/** One "Your lists" row — emoji leading, name + meta, trailing ⋯. Shared rows
    also carry a small overlapping contributor avatar stack. */
function ListRow({ list, onClick }: { list: YouList; onClick?: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      disableRipple={!onClick}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        py: '14px',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          lineHeight: 1,
        }}
      >
        {list.emoji}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          noWrap
          sx={{ fontSize: 18, fontWeight: list.roadtrip ? 600 : 500, color: tokens.ink }}
        >
          {list.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '3px' }}>
          {list.avatars && (
            <Box sx={{ display: 'flex' }}>
              {list.avatars.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt=""
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `1.5px solid ${tokens.surface}`,
                    ml: i === 0 ? 0 : '-7px',
                  }}
                />
              ))}
            </Box>
          )}
          <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
            {list.meta}
          </Typography>
        </Box>
      </Box>

      <MoreHorizIcon sx={{ fontSize: 22, color: tokens.inkSecondary, flexShrink: 0 }} />
    </ButtonBase>
  )
}

// The near-full "You / Your lists" sheet (iteration 15 entry screen). Renders
// the saved-list roster with the Skagit road-trip list as the emphasized hero
// row; the rest are inert decoys matching the real Maps "You" tab. Tapping the
// Skagit row opens the collaborative itinerary (list detail).
export function YouListsSheet({ onOpenSkagit }: YouListsSheetProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 96,
        zIndex: 6,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        display: 'flex',
        flexDirection: 'column',
        animation: `you-sheet-in 400ms ${MOTION_EMPHASIZED} both`,
        '@keyframes you-sheet-in': {
          from: { transform: 'translateY(40px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      }}
    >
      <Box sx={{ pt: '10px' }}>
        <Box
          sx={{ width: 36, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto' }}
        />
      </Box>

      {/* You header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '20px',
          pt: '14px',
        }}
      >
        <Typography sx={{ fontSize: 30, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.3px' }}>
          You
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: tokens.surfaceDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <NotificationsNoneIcon sx={{ fontSize: 22, color: tokens.ink }} />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          px: '20px',
          pb: '120px',
        }}
      >
        {/* Your lists section header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: '22px',
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 500, color: tokens.ink }}>Your lists</Typography>
          <ButtonBase
            sx={{
              height: 40,
              px: '16px',
              borderRadius: 999,
              bgcolor: tokens.cyanContainer,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AddIcon sx={{ fontSize: 20, color: tokens.onCyan }} />
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: tokens.onCyan }}>New list</Typography>
          </ButtonBase>
        </Box>

        <Box sx={{ mt: '6px' }}>
          {YOU_LISTS.map((list, index) => (
            <Box
              key={list.id}
              sx={{
                borderBottom:
                  index < YOU_LISTS.length - 1 ? `1px solid ${tokens.hairline}` : 'none',
              }}
            >
              <ListRow list={list} onClick={list.roadtrip ? onOpenSkagit : undefined} />
            </Box>
          ))}
        </Box>

        <ButtonBase
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            mx: 'auto',
            mt: '18px',
            color: tokens.inkSecondary,
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.inkSecondary }}>More</Typography>
          <ChevronRightIcon sx={{ fontSize: 20, transform: 'rotate(90deg)' }} />
        </ButtonBase>
      </Box>
    </Box>
  )
}
