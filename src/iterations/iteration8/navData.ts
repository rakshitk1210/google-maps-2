// Iteration 8 — stuck-in-traffic navigation demo data. The final destination
// is Olympic National Park (~3 hr drive); the car is currently crawling
// westbound on NE 45th St in the U District, about to turn right (north) onto
// the 11th Ave NE one-way — matching the reference screenshot's banner. The
// drawn polyline is this immediate stuck leg of the longer trip.

/** Where the stuck car sits: NE 45th St between Brooklyn and 12th Ave NE. */
export const PUCK_POSITION: [number, number] = [-122.3145, 47.66135]

/** Next-leg endpoint up 11th Ave NE (~NE 52nd St) so Directions turns right
 *  onto it; the trip continues on toward Olympic National Park from here. */
export const DESTINATION: [number, number] = [-122.3174, 47.6667]

/**
 * Hand-plotted NE 45th St → 11th Ave NE polyline, drawn when the Directions
 * API is unreachable so the demo never shows a bare map.
 */
export const FALLBACK_ROUTE: [number, number][] = [
  [-122.3145, 47.66135],
  [-122.316, 47.66135],
  [-122.3174, 47.66135],
  [-122.3174, 47.663],
  [-122.3174, 47.665],
  [-122.3174, 47.6667],
]

/** Camera framing: puck low-center with the route ahead filling the view. */
export const NAV_CENTER: [number, number] = [-122.3162, 47.6632]
export const NAV_ZOOM = 15.6

/** Queued traffic lights on the block ahead of the puck (decorative). */
export const TRAFFIC_LIGHTS: [number, number][] = [
  [-122.3158, 47.66135],
  [-122.3172, 47.66135],
]

// Instruction banner (design.md §6.13)
export const BANNER_TOWARD = 'toward'
export const BANNER_ROAD = '11th Ave NE'
export const THEN_LABEL = 'Then'

// Bottom bar — final destination is Olympic National Park, ~3 hr out.
export const TRIP_DURATION = '3 hr'
export const TRIP_META = '132 mi · 11:20 PM'

/** Google "realizes" everyone is stuck this long after mount. */
export const CHAT_FAB_DELAY_MS = 2000
