import { createContext, useContext } from 'react'
import { createTheme, type Theme } from '@mui/material'

// Iteration 7 has two palettes sharing the design.md §2 slot names: the normal
// Google blue-green set, and the Road Trip set. Road Trip keeps the map and
// surfaces at their normal subtle colors and swaps only the primary accents to
// gem purple (royal violet primaries, mustard pop on the toggle) — the
// active nav pill, the toggle, the Ask Maps accent, and the car.
export interface Tokens {
  // Ink & surfaces
  ink: string
  inkSecondary: string
  surface: string
  surfaceDim: string
  surfaceNav: string
  hairline: string

  // Map canvas (decorative CSS map)
  mapLand: string
  mapRoad: string
  mapRoadCasing: string
  mapPark: string

  // Brand & accents (design.md §2 slots; road-trip values remap the hues)
  teal: string
  cyanContainer: string
  cyanContainerSoft: string
  onCyan: string
  blue: string
  red: string
  amber: string

  // Location puck (design.md §2 --blue-dot slot; car in road-trip mode)
  puck: string
  puckHalo: string

  // Top-down car marker
  carBody: string
  carStroke: string
  carGlass: string
  carRoof: string

  // Toggle chip switch (scaled-down design.md §6.15 M3 switch)
  switchTrackOff: string
  switchThumbOff: string
  switchTrackOn: string
  switchThumbOn: string

  // Elevation — design.md rule 0.10: shadows on map elements only; all
  // floating UI chrome stays flat.
  shadowPin: string
}

export const normalTokens: Tokens = {
  ink: '#202124',
  inkSecondary: '#5F6368',
  surface: '#FFFFFF',
  surfaceDim: '#F1F3F4',
  surfaceNav: '#EEF2F6',
  hairline: '#E8EAED',

  mapLand: '#F2F3F5',
  mapRoad: '#FFFFFF',
  mapRoadCasing: '#D8DBDF',
  mapPark: '#BDE5C8',

  teal: '#0D5C63',
  cyanContainer: '#C2E7EB',
  cyanContainerSoft: '#D3EDF2',
  onCyan: '#073B41',
  blue: '#1A73E8',
  red: '#D93025',
  amber: '#FBBC04',

  puck: '#4285F4',
  puckHalo: 'rgba(66, 133, 244, 0.18)',

  carBody: '#FFFFFF',
  carStroke: '#5F6368',
  carGlass: '#AECBFA',
  carRoof: '#E8EAED',

  switchTrackOff: '#E1E3E5',
  switchThumbOff: '#FBFDFF',
  switchTrackOn: '#0D5C63',
  switchThumbOn: '#FFFFFF',

  shadowPin: '0 1px 2px rgba(60,64,67,.30), 0 2px 6px 2px rgba(60,64,67,.15)',
}

// Accents-only purple: everything not listed here stays identical to normal.
export const roadTripTokens: Tokens = {
  ...normalTokens,

  // Primary slot: deep violet takes over everywhere dark teal appeared
  teal: '#5B2C9D',
  // Tonal slot: light lavender active-nav pill / toggle-chip fill
  cyanContainer: '#E8D5F5',
  cyanContainerSoft: '#F3E8FB',
  onCyan: '#3B1A6E',
  // Ask Maps accent goes gem purple
  blue: '#7B3FA8',

  puck: '#6A3DB8',
  puckHalo: 'rgba(106, 61, 184, 0.20)',

  // The purple car: violet body, deep-indigo outline, lilac glass
  carBody: '#9B6BD6',
  carStroke: '#3B1A6E',
  carGlass: '#F3E8FB',
  carRoof: '#E8D5F5',

  switchTrackOn: '#5B2C9D',
  switchThumbOn: '#EEB23E',

  // Map-pin shadow plus a soft violet glow scoped to the car itself.
  shadowPin:
    '0 1px 2px rgba(60,64,67,.30), 0 2px 6px 2px rgba(60,64,67,.15), 0 0 14px rgba(106,61,184,0.45)',
}

// Motion, design.md §8 — M3 emphasized curve for general transitions.
export const MOTION_EMPHASIZED = 'cubic-bezier(0.2, 0, 0, 1)'

// Road Trip mode switch: nav bars swap and the palette flushes over 350ms
// ease-out (iteration 7 sketch spec).
export const NAV_SWAP_MS = 350
export const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)'
export const MODE_TRANSITION = ['background-color', 'border-color', 'color', 'fill', 'box-shadow']
  .map((prop) => `${prop} ${NAV_SWAP_MS}ms ${EASE_OUT}`)
  .join(', ')

function buildTheme(t: Tokens): Theme {
  return createTheme({
    palette: {
      primary: { main: t.teal },
      error: { main: t.red },
      background: { default: t.mapLand, paper: t.surface },
      text: { primary: t.ink, secondary: t.inkSecondary },
    },
    typography: {
      fontFamily: "'Google Sans Flex', 'Google Sans', Roboto, Helvetica, Arial, sans-serif",
    },
    shape: { borderRadius: 12 },
  })
}

export const normalTheme = buildTheme(normalTokens)
export const roadTripTheme = buildTheme(roadTripTokens)

// Unlike earlier iterations (static `tokens` import), iteration 7's tokens are
// mode-reactive, so components read the active set from context.
export const TokensContext = createContext<Tokens>(normalTokens)

export function useTokens(): Tokens {
  return useContext(TokensContext)
}
