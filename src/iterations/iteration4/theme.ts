import { createTheme } from '@mui/material'

// Design tokens from design.md §2 (color), §4 (shape & elevation).
// Components must consume these — no ad-hoc hex values in component files.
export const tokens = {
  // Ink & surfaces
  ink: '#202124',
  inkSecondary: '#5F6368',
  surface: '#FFFFFF',
  surfaceDim: '#F1F3F4',
  hairline: '#E8EAED',
  dragHandle: '#C4C7C5',
  mapLand: '#F2F3F5',

  // Brand & accents
  teal: '#0D5C63',
  tealBanner: '#0B5156',
  cyanContainer: '#C2E7EB',
  onCyan: '#073B41',
  blue: '#1A73E8',
  red: '#D93025',
  redContainer: '#F9DEDC',
  green: '#188038',
  amber: '#FBBC04',
  route: '#3A36D9',

  // Scratch-off foil (per sketch — "purpleish")
  foil: '#7E7BE8',
  foilDeep: '#5B57C9',
  surfaceNav: '#EEF2F6',

  // Elevation — iteration 4 keeps shadows ONLY on map pins (car + gem markers,
  // styled in mapMarkers.css). All floating UI chrome (search bar, chips,
  // sheets, banners, FABs, cards, toast) is intentionally flat, so these
  // component-facing tokens resolve to 'none'.
  shadowFloat: 'none',
  shadowSheet: 'none',
  shadowCard: 'none',
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
