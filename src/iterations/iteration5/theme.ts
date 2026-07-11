import { createTheme } from '@mui/material'

// Design tokens from design.md §2 (color), §4 (shape & elevation).
// Components must consume these — no ad-hoc hex values in component files.
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

  // Brand & accents
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
  route: '#3A36D9',

  // Pale blue-gray fill used by the AI route card (design.md §6.16)
  aiCard: '#E9F1F2',
  userBubble: '#EDF2F4',

  // Elevation — iteration 5 keeps shadows ONLY on map pins (car marker + avatar
  // chips, styled in mapMarkers.css). All floating UI chrome (banner, sheets,
  // FABs, chips, cards) is intentionally flat, so these tokens resolve to 'none'.
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
