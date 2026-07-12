import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import DirectionsIcon from '@mui/icons-material/Directions'
import NavigationIcon from '@mui/icons-material/Navigation'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { Cafe } from './jamData'
import { tokens } from './theme'

interface PhoneCafeSheetProps {
  cafe: Cafe
  onClose: () => void
  onSendToCar: () => void
}

const TABS = ['Overview', 'Menu', 'Reviews', 'Photos', 'Updates']

export function PhoneCafeSheet({ cafe, onClose, onSendToCar }: PhoneCafeSheetProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: '8%',
        zIndex: 9,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Box sx={{ px: '20px', pt: '8px' }}>
        <Box sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto' }} />

        {/* Header: name + action circles */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', pt: '12px' }}>
          <Typography sx={{ fontSize: 26, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px', lineHeight: 1.2, flex: 1 }}>
            {cafe.name}
          </Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '8px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>{cafe.rating}</Typography>
          <Box sx={{ display: 'flex', gap: '1px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarRoundedIcon
                key={i}
                sx={{
                  fontSize: 16,
                  color: i < Math.floor(cafe.rating) ? tokens.amber : (i < cafe.rating ? tokens.amber : tokens.hairline),
                  opacity: i < Math.floor(cafe.rating) ? 1 : (i < cafe.rating ? 0.5 : 0.4),
                }}
              />
            ))}
          </Box>
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>
            ({cafe.reviewCount.toLocaleString()})
          </Typography>
        </Box>

        {/* Drive time */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '4px' }}>
          <DirectionsCarIcon sx={{ fontSize: 18, color: tokens.inkSecondary }} />
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>{cafe.driveTime}</Typography>
        </Box>

        {/* Category · Price */}
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '4px' }}>
          {cafe.category} · {cafe.priceRange}
        </Typography>

        {/* Open status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '4px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.green }}>
            {cafe.openNote.split(' · ')[0]}
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>
            · {cafe.openNote.split(' · ')[1]}
          </Typography>
        </Box>

        {/* Action buttons row */}
        <Box sx={{ display: 'flex', gap: '10px', mt: '16px' }}>
          <Button
            startIcon={<DirectionsIcon sx={{ fontSize: 20 }} />}
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
            Directions
          </Button>
          <Button
            startIcon={<NavigationIcon sx={{ fontSize: 18, transform: 'rotate(45deg)' }} />}
            sx={{
              height: 44,
              bgcolor: tokens.ink,
              color: '#fff',
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              px: '20px',
              '&:hover': { bgcolor: tokens.ink },
            }}
          >
            Start
          </Button>
          <Button
            startIcon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 44,
              bgcolor: 'transparent',
              color: tokens.ink,
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              px: '16px',
              border: `1.5px solid ${tokens.hairline}`,
              '&:hover': { bgcolor: tokens.surfaceDim },
            }}
          >
            Ask
          </Button>
        </Box>
      </Box>

      {/* Photo carousel */}
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          mt: '20px',
          mx: '20px',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={cafe.photos[0]}
          loading="lazy"
          sx={{
            width: '65%',
            flexShrink: 0,
            height: 220,
            objectFit: 'cover',
            borderRadius: '16px 0 0 16px',
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
          <Box
            component="img"
            src={cafe.photos[1]}
            loading="lazy"
            sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 16px 0 0' }}
          />
          <Box
            component="img"
            src={cafe.photos[2]}
            loading="lazy"
            sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 0 16px 0' }}
          />
        </Box>
      </Box>

      {/* Description blurb */}
      <Box sx={{ px: '20px', mt: '16px' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.ink, lineHeight: 1.5 }}>
          {cafe.description}
        </Typography>
      </Box>

      {/* Tab row */}
      <Box
        sx={{
          display: 'flex',
          gap: '0',
          mt: '20px',
          borderBottom: `1px solid ${tokens.hairline}`,
          px: '20px',
        }}
      >
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
              cursor: 'pointer',
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
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink }}>
            Know before you go
          </Typography>
          <Box
            sx={{
              bgcolor: tokens.cyanContainer,
              borderRadius: 999,
              px: '10px',
              py: '2px',
              fontSize: 12,
              fontWeight: 600,
              color: tokens.onCyan,
            }}
          >
            New!
          </Box>
        </Box>

        <Box sx={{ mt: '16px', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {cafe.highlights.map((highlight, i) => (
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
                <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.ink, lineHeight: 1.4 }}>
                  •
                </Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.ink, lineHeight: 1.4 }}>
                  {highlight}
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ fontSize: 22, color: tokens.inkSecondary, flexShrink: 0 }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* More photos row */}
      <Box sx={{ px: '20px', mt: '20px' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, mb: '12px' }}>
          Photos
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {cafe.photos.slice(0, 6).map((url, i) => (
            <Box
              key={i}
              component="img"
              src={url}
              loading="lazy"
              sx={{
                width: 130,
                height: 130,
                flexShrink: 0,
                borderRadius: '12px',
                objectFit: 'cover',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ px: '20px', pt: '24px', pb: '24px', mt: 'auto' }}>
        <Button
          startIcon={<DirectionsCarIcon sx={{ fontSize: 20 }} />}
          onClick={onSendToCar}
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
          Send to CarPlay
        </Button>
      </Box>
    </Box>
  )
}
