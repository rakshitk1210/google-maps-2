import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import DirectionsIcon from '@mui/icons-material/Directions'
import NavigationIcon from '@mui/icons-material/Navigation'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { TripStop } from './roadTripData'
import { SAMPLE_REVIEWS } from './roadTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface StopDetailSheetProps {
  stop: TripStop
  stopIndex: number
  onClose: () => void
  /** Pick this stop as the trip's first destination and start driving to it. */
  onGoFirst: (stop: TripStop) => void
}

const TABS = ['Overview', 'Reviews', 'Photos', 'About']

/** Renders `rating`'s worth of amber stars (with a dimmed remainder). */
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <Box sx={{ display: 'flex', gap: '1px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarRoundedIcon
          key={i}
          sx={{
            fontSize: size,
            color: tokens.amber,
            opacity: i < Math.floor(rating) ? 1 : i < rating ? 0.5 : 0.25,
          }}
        />
      ))}
    </Box>
  )
}

// Place-detail sheet for a single road-trip stop. Reuses the rich place-page
// pattern from earlier iterations (hero photos, rating/reviews, "know before
// you go", photo strip) and adds a "Go here first" CTA that makes this stop the
// trip's first destination. Opens on top of the itinerary; closing returns to it.
export function StopDetailSheet({ stop, stopIndex, onClose, onGoFirst }: StopDetailSheetProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: '9%',
        zIndex: 10,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        animation: `stop-up 300ms ${MOTION_EMPHASIZED} both`,
        '@keyframes stop-up': {
          from: { opacity: 0, transform: 'translateY(60px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ px: '20px', pt: '8px' }}>
        <Box sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto' }} />

        {/* Header: name + action circles */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', pt: '12px' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.blue, letterSpacing: '0.3px' }}>
              STOP {stopIndex + 1}
            </Typography>
            <Typography sx={{ fontSize: 26, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px', lineHeight: 1.2 }}>
              {stop.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {[
              { icon: <BookmarkBorderIcon sx={{ fontSize: 22, color: tokens.ink }} />, label: 'Save' },
              { icon: <ShareOutlinedIcon sx={{ fontSize: 22, color: tokens.ink }} />, label: 'Share' },
              { icon: <CloseIcon sx={{ fontSize: 22, color: tokens.ink }} />, label: 'Close', onClick: onClose },
            ].map((btn) => (
              <IconButton
                key={btn.label}
                aria-label={btn.label}
                onClick={btn.onClick}
                sx={{ width: 44, height: 44, bgcolor: tokens.surfaceDim, '&:hover': { bgcolor: tokens.surfaceDim } }}
              >
                {btn.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Rating + reviews */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>{stop.rating}</Typography>
          <Stars rating={stop.rating} />
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>
            ({stop.reviewCount.toLocaleString()})
          </Typography>
        </Box>

        {/* Category · price */}
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '4px' }}>
          {stop.category} · {stop.priceRange}
        </Typography>

        {/* Open status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '4px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.green }}>
            {stop.openNote.split(' · ')[0]}
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>
            · {stop.openNote.split(' · ')[1]}
          </Typography>
        </Box>

        {/* Drive time from Seattle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '4px' }}>
          <DirectionsCarIcon sx={{ fontSize: 18, color: tokens.inkSecondary }} />
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>
            {stop.etaDuration} from Seattle · {stop.milesFromStart} mi
          </Typography>
        </Box>

        {/* Action buttons row */}
        <Box sx={{ display: 'flex', gap: '10px', mt: '16px' }}>
          <Button
            startIcon={<DirectionsIcon sx={{ fontSize: 20 }} />}
            onClick={() => onGoFirst(stop)}
            sx={{
              height: 44,
              bgcolor: tokens.teal,
              color: '#fff',
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              px: '20px',
              '&:hover': { bgcolor: tokens.teal },
            }}
          >
            Go here first
          </Button>
          <Button
            startIcon={<BookmarkBorderIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 44,
              bgcolor: tokens.cyanContainer,
              color: tokens.onCyan,
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              px: '18px',
              '&:hover': { bgcolor: tokens.cyanContainer },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Photo hero — 65 / 35 split */}
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          mt: '20px',
          mx: '20px',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={stop.photos[0]}
          loading="lazy"
          alt={stop.name}
          sx={{ width: '65%', flexShrink: 0, height: 220, objectFit: 'cover', borderRadius: '16px 0 0 16px' }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
          <Box
            component="img"
            src={stop.photos[1]}
            loading="lazy"
            alt=""
            sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 16px 0 0' }}
          />
          <Box
            component="img"
            src={stop.photos[2] ?? stop.photos[1]}
            loading="lazy"
            alt=""
            sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 0 16px 0' }}
          />
        </Box>
      </Box>

      {/* Description */}
      <Box sx={{ px: '20px', mt: '16px' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.ink, lineHeight: 1.5 }}>
          {stop.description}
        </Typography>
      </Box>

      {/* Tab row (static, indicative) */}
      <Box sx={{ display: 'flex', mt: '20px', borderBottom: `1px solid ${tokens.hairline}`, px: '20px' }}>
        {TABS.map((tab, i) => (
          <Box
            key={tab}
            sx={{
              py: '12px',
              px: '14px',
              fontSize: 15,
              fontWeight: 500,
              color: i === 0 ? tokens.teal : tokens.inkSecondary,
              borderBottom: i === 0 ? `3px solid ${tokens.teal}` : '3px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </Box>
        ))}
      </Box>

      {/* Know before you go */}
      <Box sx={{ px: '20px', mt: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 22, color: tokens.teal }} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink }}>Know before you go</Typography>
        </Box>
        <Box sx={{ mt: '8px' }}>
          {stop.highlights.map((highlight, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: '14px',
                borderTop: i > 0 ? `1px solid ${tokens.hairline}` : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, pr: '8px' }}>
                <Typography sx={{ fontSize: 15, color: tokens.ink, lineHeight: 1.4 }}>•</Typography>
                <Typography sx={{ fontSize: 15, color: tokens.ink, lineHeight: 1.4 }}>{highlight}</Typography>
              </Box>
              <ChevronRightIcon sx={{ fontSize: 22, color: tokens.inkSecondary, flexShrink: 0 }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Reviews */}
      <Box sx={{ px: '20px', mt: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink }}>Reviews</Typography>
          <Typography sx={{ fontSize: 14, color: tokens.inkSecondary }}>
            {stop.rating} · {stop.reviewCount.toLocaleString()} reviews
          </Typography>
        </Box>
        <Box sx={{ mt: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SAMPLE_REVIEWS.map((review) => (
            <Box key={review.name}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Box
                  component="img"
                  src={review.avatar}
                  alt=""
                  sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>{review.name}</Typography>
                  <Stars rating={review.rating} size={14} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 15, color: tokens.ink, lineHeight: 1.5, mt: '8px' }}>
                {review.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Photos strip */}
      <Box sx={{ px: '20px', mt: '20px' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, mb: '12px' }}>Photos</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {stop.photos.map((url, i) => (
            <Box
              key={i}
              component="img"
              src={url}
              loading="lazy"
              alt=""
              sx={{ width: 130, height: 130, flexShrink: 0, borderRadius: '12px', objectFit: 'cover' }}
            />
          ))}
        </Box>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ px: '20px', pt: '24px', pb: '24px', mt: 'auto' }}>
        <Button
          startIcon={<NavigationIcon sx={{ fontSize: 20 }} />}
          onClick={() => onGoFirst(stop)}
          fullWidth
          sx={{
            height: 52,
            bgcolor: tokens.teal,
            color: '#fff',
            borderRadius: 999,
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.teal },
          }}
        >
          Start drive · go here first
        </Button>
      </Box>
    </Box>
  )
}
