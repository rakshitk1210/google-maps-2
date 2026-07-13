import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { Avatar, Box, Typography } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ExploreIcon from '@mui/icons-material/Explore'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined'
import DiamondIcon from '@mui/icons-material/Diamond'
import {
  ALEX_GEM_LABEL,
  ASK_MAPS_LABEL,
  GEM_POSITION,
  HOME_TOAST_LABEL,
  KELLEY_GEM_LABEL,
  KELLEY_GEM_POSITION,
  SEARCH_PLACEHOLDER,
} from './gemData'
import { MOTION_EMPHASIZED, tokens } from './theme'
import './mapMarkers.css'

const HOME_GEM_SVG = `
<svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 3h10l4 6-9 12L3 9l4-6z" fill="${tokens.teal}"/>
  <path d="M7 3l2.5 6L12 3H7zm5 0l2.5 6L17 3h-5zM3 9h6l3 12L3 9zm12 0h6l-9 12 3-12z" fill="rgba(255,255,255,0.25)"/>
</svg>`

function makeGemPin(label: string) {
  const el = document.createElement('div')
  el.className = 'gem-pin gem-pin--destination'
  el.innerHTML = `
    <span class="gem-label">${label}</span>
    <div class="gem-head-wrap">
      <div class="gem-head">${HOME_GEM_SVG}</div>
    </div>
    <div class="gem-point"></div>`
  return el
}

const CHIPS = ['Restaurants', 'Coffee', 'Gas', 'Groceries']

// Lightweight Explore home shown after a gem is created. Its own Mapbox map
// centers on the shared spot with two gem pins — Alex's original plus the one
// the user just created (Kelley) — and a "Gem created" toast above the nav.
export function HomeScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    // Fade in on mount, then auto-dismiss after 4s.
    const raf = requestAnimationFrame(() => setToastVisible(true))
    const timer = window.setTimeout(() => setToastVisible(false), 4000)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const center: [number, number] = [
      (GEM_POSITION[0] + KELLEY_GEM_POSITION[0]) / 2,
      (GEM_POSITION[1] + KELLEY_GEM_POSITION[1]) / 2,
    ]
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: 15.5,
      pitch: 45,
      attributionControl: false,
    })
    mapRef.current = map
    // Google Maps tile palette (design.md §9) over the raw Mapbox style.
    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => map.resize())

    new mapboxgl.Marker({ element: makeGemPin(ALEX_GEM_LABEL), anchor: 'bottom' })
      .setLngLat(GEM_POSITION)
      .addTo(map)
    new mapboxgl.Marker({ element: makeGemPin(KELLEY_GEM_LABEL), anchor: 'bottom' })
      .setLngLat(KELLEY_GEM_POSITION)
      .addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 30, bgcolor: tokens.mapLand, borderRadius: 'inherit', overflow: 'hidden' }}>
      <div ref={containerRef} className="map-canvas" />

      {/* Search bar (design.md 6.1) */}
      <Box sx={{ position: 'absolute', top: 62, left: 16, right: 16, zIndex: 4 }}>
        <Box
          sx={{
            height: 56,
            bgcolor: tokens.surface,
            borderRadius: 999,
            boxShadow: tokens.shadowFloat,
            display: 'flex',
            alignItems: 'center',
            pl: '16px',
            pr: '10px',
            gap: '12px',
          }}
        >
          <DiamondIcon sx={{ fontSize: 24, color: tokens.teal }} />
          <Typography sx={{ flex: 1, fontSize: 19, fontWeight: 400, color: tokens.inkSecondary }}>
            {SEARCH_PLACEHOLDER}
          </Typography>
          <MicIcon sx={{ fontSize: 24, color: tokens.inkSecondary }} />
          <CenterFocusStrongIcon sx={{ fontSize: 24, color: tokens.inkSecondary }} />
          <Avatar sx={{ width: 36, height: 36, bgcolor: tokens.cyanContainer, color: tokens.onCyan, fontSize: 15, fontWeight: 500 }}>
            Y
          </Avatar>
        </Box>

        {/* Chip row (design.md 6.2) */}
        <Box
          sx={{
            mt: '12px',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              height: 44,
              px: '16px',
              borderRadius: 999,
              bgcolor: tokens.surface,
              border: `1.5px solid ${tokens.blue}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: tokens.shadowFloat,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 22, color: tokens.blue }} />
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.blue }}>{ASK_MAPS_LABEL}</Typography>
          </Box>
          {CHIPS.map((chip) => (
            <Box
              key={chip}
              sx={{
                flexShrink: 0,
                height: 44,
                px: '16px',
                borderRadius: 999,
                bgcolor: tokens.surface,
                display: 'flex',
                alignItems: 'center',
                boxShadow: tokens.shadowFloat,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink }}>{chip}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* "Gem created" toast */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 100,
          left: 16,
          right: 16,
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            bgcolor: tokens.surface,
            borderRadius: 999,
            boxShadow: tokens.shadowFloat,
            height: 48,
            px: '20px',
            opacity: toastVisible ? 1 : 0,
            transform: toastVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 300ms ${MOTION_EMPHASIZED}, transform 300ms ${MOTION_EMPHASIZED}`,
            pointerEvents: 'none',
          }}
        >
          <DiamondIcon sx={{ fontSize: 22, color: tokens.teal }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink }}>{HOME_TOAST_LABEL}</Typography>
        </Box>
      </Box>

      {/* Bottom navigation (design.md 6.4) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          height: 84,
          pt: '8px',
          bgcolor: tokens.surfaceNav,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
        }}
      >
        <NavItem active label="Explore" icon={<ExploreIcon sx={{ fontSize: 24, color: tokens.teal }} />} />
        <NavItem label="Saved" icon={<BookmarkBorderIcon sx={{ fontSize: 24, color: tokens.ink }} />} />
        <NavItem label="Contribute" icon={<AddCircleOutlineIcon sx={{ fontSize: 24, color: tokens.ink }} />} />
      </Box>
    </Box>
  )
}

interface NavItemProps {
  label: string
  icon: React.ReactNode
  active?: boolean
}

function NavItem({ label, icon, active = false }: NavItemProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', pt: '6px', width: 72 }}>
      <Box
        sx={{
          width: 64,
          height: 32,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: active ? tokens.cyanContainer : 'transparent',
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? tokens.ink : tokens.inkSecondary }}
      >
        {label}
      </Typography>
    </Box>
  )
}
