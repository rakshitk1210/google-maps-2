import { createTheme } from '@mui/material'

// Design tokens from design.md §2 (color), §4 (shape & elevation). Iteration 9
// uses the standard Google Maps teal/cyan accent set for CTAs, chips, and
// active chrome (Start, Add stop, Road Trip tab, filter chips).
export const tokens = {
  // Ink & surfaces
  ink: '#202124',
  inkSecondary: '#5F6368',
  surface: '#FFFFFF',
  surfaceDim: '#F1F3F4',
  surfaceNav: '#EEF2F6',
  hairline: '#E8EAED',
  dragHandle: '#C4C7C5',
  mapLand: '#F2F3F5',

  // Brand & accents (design.md §2)
  teal: '#0D5C63',
  tealBanner: '#0B5156',
  tealThen: '#093F44',
  cyanContainer: '#C2E7EB',
  cyanContainerSoft: '#D3EDF2',
  onCyan: '#073B41',
  blue: '#1A73E8',
  red: '#D93025',
  redContainer: '#F9DEDC',
  green: '#188038',
  amber: '#FBBC04',
  // Normal-drive polyline — Google blue (iteration 8's red was traffic-only).
  route: '#4285F4',

  // Location puck (design.md §2 --blue-dot family; the chevron in nav)
  puck: '#4285F4',
  puckHalo: 'rgba(66, 133, 244, 0.18)',

  // Elevation — shadows ONLY on map-surface elements (puck, destination pin;
  // rule 0.10). All floating chrome is intentionally flat.
  shadowPin: '0 1px 2px rgba(60,64,67,.30), 0 2px 6px 2px rgba(60,64,67,.15)',
  shadowFloat: 'none',
  shadowSheet: 'none',
} as const

// Motion, design.md §8 — M3 emphasized curve.
export const MOTION_EMPHASIZED = 'cubic-bezier(0.2, 0, 0, 1)'

export const theme = createTheme({
  palette: {
    primary: { main: tokens.teal },
    error: { main: tokens.red },
    background: { default: tokens.mapLand, paper: tokens.surface },
    text: { primary: tokens.ink, secondary: tokens.inkSecondary },
  },
  typography: {
    fontFamily: "'Google Sans Flex', 'Google Sans', Roboto, Helvetica, Arial, sans-serif",
  },
  shape: { borderRadius: 12 },
})
