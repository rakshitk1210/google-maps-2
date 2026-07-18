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
  tealThen: '#093F44',
  blue: '#1A73E8',
  red: '#D93025',
  redContainer: '#F9DEDC',
  green: '#188038',
  amber: '#FBBC04',
  // Active nav polyline — red to convey the heavy traffic on this leg.
  route: '#D93025',

  // Location puck (design.md §2 --blue-dot family; iteration 8 shows the
  // Google-blue nav chevron instead of the dot/car).
  puck: '#4285F4',
  puckHalo: 'rgba(66, 133, 244, 0.18)',

  // Compass needle in the nav rail (matches Google's red/gray needle).
  compassNorth: '#EA4335',
  compassSouth: '#9AA0A6',

  // Pale blue-gray fill for the user's own chat bubble (design.md §6.16)
  userBubble: '#EDF2F4',

  // Elevation — shadows ONLY on map-surface elements (puck, traffic lights,
  // ETA callout; rule 0.10). All floating chrome is intentionally flat.
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
