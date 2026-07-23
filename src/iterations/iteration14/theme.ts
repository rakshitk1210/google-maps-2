import { createTheme } from '@mui/material'

// Design tokens from design.md §2 (color), §4 (shape & elevation).
// Components must consume these — no ad-hoc hex values in component files.
//
// Iteration 14 ships light mode only, but every color lives behind the
// CarPlayTokens interface so a dark variant is a second object + alias swap,
// with zero component changes.
export interface CarPlayTokens {
  // Ink & surfaces
  ink: string
  inkSecondary: string
  surface: string
  surfaceDim: string
  hairline: string
  mapLand: string

  // Brand & accents
  teal: string
  tealBanner: string
  blue: string
  blueContainer: string
  cyanContainer: string
  cyanContainerSoft: string
  onCyan: string
  green: string
  greenContainer: string
  red: string
  redContainer: string
  // Red legible on the dark overlay pill — raw --red fails contrast there.
  redOnDark: string
  amber: string
  route: string
  navPuck: string

  // Floating info surfaces on the map, matching the real CarPlay layout: a
  // dark ETA pill reads cleanly over light tiles.
  overlaySurface: string
  overlayOn: string
  overlayOnDim: string
  overlayHighlight: string

  // Device hardware chrome (stage frame around the screen — not in-app UI)
  carPlayBezel: string
  carPlayStatusBg: string
  shadowDevice: string

  // Elevation — shadows ONLY on map pins (puck / destination pin, styled in
  // mapMarkers.css). All floating UI chrome is intentionally flat.
  shadowFloat: string
  shadowSheet: string
}

export const light: CarPlayTokens = {
  ink: '#202124',
  inkSecondary: '#5F6368',
  surface: '#FFFFFF',
  surfaceDim: '#F1F3F4',
  hairline: '#E8EAED',
  mapLand: '#F2F3F5',

  teal: '#0D5C63',
  tealBanner: '#0B5156',
  blue: '#1A73E8',
  blueContainer: '#E8F0FE',
  cyanContainer: '#C2E7EB',
  cyanContainerSoft: '#D3EDF2',
  onCyan: '#073B41',
  green: '#188038',
  greenContainer: '#E6F4EA',
  red: '#D93025',
  redContainer: '#F9DEDC',
  redOnDark: '#F28B82',
  amber: '#FBBC04',
  route: '#3A36D9',
  navPuck: '#4285F4',

  overlaySurface: 'rgba(32, 33, 36, 0.92)',
  overlayOn: '#FFFFFF',
  overlayOnDim: 'rgba(255, 255, 255, 0.68)',
  overlayHighlight: '#8AB4F8',

  carPlayBezel: '#17181A',
  carPlayStatusBg: '#0F1113',
  shadowDevice: '0 4px 24px rgba(0, 0, 0, 0.12)',

  shadowFloat: 'none',
  shadowSheet: 'none',
}

export const tokens = light

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
