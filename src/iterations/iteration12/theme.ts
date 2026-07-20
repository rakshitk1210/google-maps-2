import { createTheme } from '@mui/material'

// Design tokens from design.md §2 (color), §4 (shape & elevation).
// Components must consume these — no ad-hoc hex values in component files.
//
// Iteration 12 ships light mode only, but every color lives behind the
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
  green: string
  greenContainer: string
  red: string
  redContainer: string
  amber: string
  route: string
  navPuck: string

  // Floating info surfaces on the map, matching the real CarPlay layout: a
  // dark ETA pill and a dark speedometer read cleanly over light tiles.
  overlaySurface: string
  overlayOn: string
  overlayOnDim: string
  overlayHighlight: string

  // Gemini voice treatment (sketch: gradient ring, glow, loader, map wipe)
  geminiGradient: string
  geminiRingIdle: string
  geminiLoader: string
  geminiGlow: string
  geminiGlowSoft: string
  geminiGlowStrong: string
  wipeGradient: string

  // Device hardware chrome (stage frame around the screen — not in-app UI)
  carPlayBezel: string
  carPlayStatusBg: string
  shadowDevice: string

  // Voice-session glow — deliberate, scoped exception to design.md rule 0.10:
  // applied only to the Gemini orb and the screen-edge overlay while Gemini
  // is speaking/listening, never to ordinary floating chrome.
  innerGlow: string

  // Elevation — shadows ONLY on map pins (car marker, styled in
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
  green: '#188038',
  greenContainer: '#E6F4EA',
  red: '#D93025',
  redContainer: '#F9DEDC',
  amber: '#FBBC04',
  route: '#3A36D9',
  navPuck: '#4285F4',

  overlaySurface: 'rgba(32, 33, 36, 0.92)',
  overlayOn: '#FFFFFF',
  overlayOnDim: 'rgba(255, 255, 255, 0.68)',
  overlayHighlight: '#8AB4F8',

  // Google blue → purple → coral, same mark as iteration 11's Gemini CTA.
  geminiGradient: 'linear-gradient(90deg, #4285F4, #9B72CB, #D96570)',
  geminiRingIdle: '#E8EAED',
  geminiLoader:
    'conic-gradient(from 0deg, #4285F4, #9B72CB, #D96570, rgba(66, 133, 244, 0) 62%, rgba(66, 133, 244, 0) 100%)',
  geminiGlow: '0 0 16px rgba(66, 133, 244, 0.45)',
  geminiGlowSoft: '0 0 8px rgba(66, 133, 244, 0.30)',
  geminiGlowStrong: '0 0 22px rgba(66, 133, 244, 0.55)',
  // Subtle blue-and-white sweep, per the sketch's download affirmation.
  wipeGradient:
    'linear-gradient(105deg, rgba(66, 133, 244, 0) 0%, rgba(66, 133, 244, 0.16) 35%, rgba(255, 255, 255, 0.65) 50%, rgba(66, 133, 244, 0.16) 65%, rgba(66, 133, 244, 0) 100%)',

  carPlayBezel: '#17181A',
  carPlayStatusBg: '#0F1113',
  shadowDevice: '0 4px 24px rgba(0, 0, 0, 0.12)',

  innerGlow: 'inset 0 0 20px rgba(26, 115, 232, 0.35)',

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
