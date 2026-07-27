// Iteration 17 — the North Cascades trip seen from inside the drive.
//
// The trip's places come straight from iteration 16 (same shared list, same
// people) so the two iterations can't drift apart; what's new here is the drive
// itself: the route through Marysville on WA-529, the Cafe Ladro billboard
// standing beside it, and the two banner/ETA states the reroute swaps between.

import {
  CATEGORIES,
  CONTRIBUTORS,
  SHARED_PLACES,
  TRIP_MILES,
  TRIP_TITLE,
  type Category,
  type Contributor,
  type TripPlace,
} from '../iteration16/tripData'

import ladro1 from './assets/ladro-1.jpg'
import ladro2 from './assets/ladro-2.jpg'
import ladro3 from './assets/ladro-3.jpg'
import gridLakeHero from './assets/grid-lake-hero.png'
import gridAutumnLake from './assets/grid-autumn-lake.png'
import gridCrystalLake from '../iteration16/assets/grid-crystal-lake.png'
import gridPineValley from '../iteration16/assets/grid-pine-valley.png'
import gridSunsetRidge from '../iteration16/assets/grid-sunset-ridge.png'
import gridMapleGrove from '../iteration16/assets/grid-maple-grove.png'

export { CATEGORIES, CONTRIBUTORS, TRIP_MILES, TRIP_TITLE }
export type { Category, Contributor, TripPlace }

type LngLat = [number, number]

/* ------------------------------------------------------------------ drive */

/** I-5 / WA-529 north of Everett — the stretch the Figma frame is shot over. */
export const ROUTE_ORIGIN: LngLat = [-122.1836, 48.023]
/** Far enough north-east that the drive never runs out mid-demo. */
export const ROUTE_DEST: LngLat = [-121.98, 48.29]

/** Cafe Ladro, a couple of minutes off the highway once the reroute commits. */
export const CAFE_DEST: LngLat = [-122.161, 48.056]

/**
 * Where the billboard stands, measured along the real route rather than fixed
 * to a coordinate — the road curves, and a hand-picked lngLat ends up off the
 * carriageway and clipped out of frame.
 *
 * The distance is not arbitrary: at pitch 60 the projection is steeply
 * non-linear, and anything much beyond this sits pinned at the horizon behind
 * the instruction banner for the whole demo.
 */
export const BILLBOARD_ALONG_METERS = 520
/**
 * To the left of the direction of travel. The route swings right through the
 * WA-529 interchange, so right-hand signage is carried off the edge of the
 * frame; standing it on the near side keeps the whole card in view.
 */
export const BILLBOARD_OFFSET_METERS = 80

/**
 * ~36 mph. Slower than iteration 14's 34 m/s: the billboard is the interaction,
 * and at highway speed it sweeps past in a few seconds. This keeps it clearly
 * on screen for roughly the first minute of the drive.
 */
export const DRIVE_SPEED_MPS = 16

/** Camera while driving — the Figma frame's pitched, road-level view. */
export const DRIVE_ZOOM = 15.2
export const DRIVE_PITCH = 60

/* ------------------------------------------------- banner + ETA per target */

export interface NavState {
  /** Big road name in the banner. */
  road: string
  /** ETA duration, green. */
  duration: string
  /** Gray line under it. */
  meta: string
}

/** Heading up the trip route, before any detour. */
export const NAV_TRIP: NavState = {
  road: '11th Ave NE',
  duration: '1 hr 54 min',
  meta: '103 mi · 6:43 PM',
}

/** After Start commits the detour to the café. */
export const NAV_CAFE: NavState = {
  road: 'Cafe Ladro',
  duration: '6 min',
  meta: '2.4 mi · 4:56 PM',
}

/* --------------------------------------------------------------- the café */

export const CAFE_LADRO = {
  id: 'cafe-ladro',
  name: 'Cafe Ladro',
  tagline: 'Quirky espresso bar · 4 mi ahead',
  category: 'Cafe',
  priceRange: '$$',
  rating: 4.9,
  reviewCount: 214,
  detourNote: 'Adds 6 min to your trip',
  openNote: 'Open · Closes 6 PM',
  description:
    'A beloved institution pulling silky espresso since 1994. Mismatched vintage armchairs, a resident cafe cat named Miso, and a rotating wall of local art make it a wonderfully quirky perch just off your route.',
  highlights: [
    'Regulars rave about the honey-lavender latte',
    'House-made almond croissants sell out by noon',
    'Easy in-and-out — parking right off the exit',
  ],
  photos: [ladro1, ladro2, ladro3],
} as const

/* ----------------------------------------------------------------- the list */

/**
 * The trip list, with this iteration's photography swapped in. The Figma
 * refreshed the grid imagery, so the first six places carry the new crops and
 * the rest keep iteration 16's — the list page leads with the new hero either
 * way, since that card is the one that spans two rows.
 */
const LIST_PHOTOS = [
  gridLakeHero,
  gridAutumnLake,
  gridPineValley,
  gridCrystalLake,
  gridSunsetRidge,
  gridMapleGrove,
]

export const TRIP_PLACES: TripPlace[] = SHARED_PLACES.map((place, index) =>
  index < LIST_PHOTOS.length ? { ...place, photo: LIST_PHOTOS[index] } : place,
)
