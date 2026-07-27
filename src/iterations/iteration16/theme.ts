import { createTheme } from '@mui/material'

// Design tokens from design.md §2 (color), §4 (shape & elevation), matched
// against the iteration-16 Figma frames (variables ink/*, surface/*, cyan/*).
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
  cyanContainer: '#C2E7EB',
  cyanContainerSoft: '#D3EDF2',
  onCyan: '#073B41',
  blue: '#1A73E8',
  red: '#D93025',
  green: '#188038',
  amber: '#FBBC04',

  // Frosted chrome floating over the map (Figma: rgba(255,255,255,.8) + blur).
  frost: 'rgba(255, 255, 255, 0.8)',
  frostBlur: 'blur(12px)',

  // Elevation — map pins carry the Figma "Elevation/Map Pin" pair; the floating
  // circle buttons carry "Elevation/Device". Sheets stay flat (rule 0.10).
  shadowPin: '0 1px 2px rgba(60,64,67,.30), 0 2px 6px 2px rgba(60,64,67,.15)',
  shadowChrome: '0 4px 24px rgba(0,0,0,.12)',
  shadowSheet: 'none',

  // Gemini / Ask Maps gradient (Figma "Gemini/Gradient").
  geminiGradient: 'linear-gradient(90deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)',
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
