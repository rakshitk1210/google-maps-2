import { Box, Button, ButtonBase, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import CallIcon from '@mui/icons-material/Call'
import StyleIcon from '@mui/icons-material/Style'
import { FEATURED_RESTAURANT, FILTER_CHIPS } from './jamTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface RestaurantsSheetProps {
  onClose: () => void
  onQuickDecide: () => void
}

// Results sheet for "Restaurants along route", modeled on the real Google Maps
// screenshot: header with search/close circles, filter chips, the Just Burgers
// row with Add stop / Call pills — plus the demo's own twist pinned at the
// bottom, the blue Quick Decide button that opens the jam's swipe deck.
export function RestaurantsSheet({ onClose, onQuickDecide }: RestaurantsSheetProps) {
  const r = FEATURED_RESTAURANT
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 8,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        pt: '8px',
        pb: '16px',
        animation: `results-up 320ms ${MOTION_EMPHASIZED} both`,
        '@keyframes results-up': {
          from: { opacity: 0, transform: 'translateY(60px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ width: 40, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto' }} />

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: '20px', mt: '10px' }}>
        <Typography sx={{ flex: 1, fontSize: 24, fontWeight: 500, color: tokens.ink }}>
          Restaurants
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <ButtonBase
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
            <SearchIcon sx={{ fontSize: 22, color: tokens.ink }} />
          </ButtonBase>
          <ButtonBase
            aria-label="Close restaurants"
            onClick={onClose}
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
            <CloseIcon sx={{ fontSize: 22, color: tokens.ink }} />
          </ButtonBase>
        </Box>
      </Box>

      {/* Filter chips */}
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          px: '20px',
          mt: '14px',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {FILTER_CHIPS.map((chip, i) => {
          const selected = i === 0
          return (
            <ButtonBase
              key={chip}
              sx={{
                height: 36,
                px: '14px',
                borderRadius: 999,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                bgcolor: selected ? tokens.cyanContainer : tokens.surfaceDim,
                color: selected ? tokens.onCyan : tokens.ink,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
              }}
            >
              {chip}
              {selected && <ExpandMoreIcon sx={{ fontSize: 18, mr: '-4px' }} />}
            </ButtonBase>
          )
        })}
      </Box>

      {/* Featured row — Just Burgers, from the real screenshot */}
      <Box sx={{ display: 'flex', gap: '14px', px: '20px', mt: '18px' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, color: tokens.ink }}>{r.name}</Typography>
          <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary, mt: '2px' }}>
            {r.tagline}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '4px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
              {r.rating.toFixed(1)}
            </Typography>
            <StarRoundedIcon sx={{ fontSize: 17, color: tokens.amber }} />
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
              · {r.price} ·{' '}
              <Box component="span" sx={{ color: tokens.green }}>
                {r.openNote}
              </Box>
            </Typography>
          </Box>
          <Typography noWrap sx={{ fontSize: 14, fontWeight: 500, color: tokens.ink, mt: '2px' }}>
            {r.detourNote}
          </Typography>
        </Box>
        <Box
          component="img"
          src={r.photo}
          alt={r.name}
          sx={{ width: 76, height: 76, borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
        />
      </Box>

      {/* Row actions (decorative) */}
      <Box sx={{ display: 'flex', gap: '10px', px: '20px', mt: '12px' }}>
        <ButtonBase
          sx={{
            height: 44,
            px: '18px',
            borderRadius: 999,
            bgcolor: tokens.cyanContainer,
            color: tokens.onCyan,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
        >
          <AddLocationAltOutlinedIcon sx={{ fontSize: 20 }} />
          Add stop
        </ButtonBase>
        <ButtonBase
          sx={{
            height: 44,
            px: '18px',
            borderRadius: 999,
            bgcolor: tokens.cyanContainerSoft,
            color: tokens.onCyan,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
        >
          <CallIcon sx={{ fontSize: 20 }} />
          Call
        </ButtonBase>
      </Box>

      {/* Quick Decide — the jam's shared swipe deck */}
      <Box sx={{ px: '20px', mt: '16px', borderTop: `1px solid ${tokens.hairline}`, pt: '16px' }}>
        <Button
          onClick={onQuickDecide}
          startIcon={<StyleIcon sx={{ fontSize: 22 }} />}
          sx={{
            width: '100%',
            height: 52,
            borderRadius: 999,
            bgcolor: tokens.blue,
            color: '#fff',
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.blue },
          }}
        >
          Quick Decide with the jam
        </Button>
      </Box>
    </Box>
  )
}
