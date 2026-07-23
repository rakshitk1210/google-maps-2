import { WINNIE_AVATAR, MEMBER_AVATARS } from '../../shared/peopleAvatars'

export { MEMBER_AVATARS }

// ── The jam ──────────────────────────────────────────────────────────────────
export const JAM_NAME = "Kelley's Jam"
export const KELLEY_DISPLAY_NAME = 'Kelley'

// ── Geography ────────────────────────────────────────────────────────────────
// The jam is on I-5 near NE 50th St in Seattle, headed out to Olympic National
// Park. Sits on the freeway itself so Directions keeps the route on I-5 before
// it peels off onto WA-16 and US-101.
export const PUCK_POSITION: [number, number] = [-122.3219, 47.664]
export const NAV_ZOOM = 15.6

export interface NavDestination {
  name: string
  lngLat: [number, number]
  duration: string
  meta: string
  bannerRoad: string
  arriveTime: string
}

export const TRIP_DESTINATION: NavDestination = {
  name: 'Olympic National Park',
  lngLat: [-123.4993, 47.9686],
  duration: '3 hr 10 min',
  meta: '147 mi · 8:12 PM',
  bannerRoad: 'I-5 S',
  arriveTime: 'Arrive 8:12 PM',
}

// Where the drive lands after the jam matches on Hungry Panda.
export const MATCH_NAV: NavDestination = {
  name: 'Hungry Panda',
  lngLat: [-122.6851, 47.5326],
  duration: '38 min',
  meta: '32 mi · 6:34 PM',
  bannerRoad: 'WA-16 W',
  arriveTime: 'Arrive 6:34 PM',
}

export const ORIGIN_LABEL = 'Current location · I-5 S'

// Rough I-5 / WA-16 / US-101 spine (Seattle → Olympic National Park) so the
// demo never shows a bare map if the Directions API fails.
export const FALLBACK_ROUTE: [number, number][] = [
  [-122.3219, 47.664],
  [-122.3287, 47.5813],
  [-122.4443, 47.2529],
  [-122.5514, 47.2707],
  [-122.6215, 47.3862],
  [-122.6851, 47.5326],
  [-122.9004, 47.2265],
  [-123.1007, 47.2151],
  [-123.1462, 47.4048],
  [-123.0034, 48.0721],
  [-123.4307, 48.1181],
  [-123.4993, 47.9686],
]

export const BANNER_TOWARD = 'toward'
export const THEN_LABEL = 'Then'

// ── Restaurants along the route ──────────────────────────────────────────────
export interface Restaurant {
  id: string
  name: string
  tagline: string
  rating: number
  reviewCount: number
  price: string
  openNote: string
  detourNote: string
  photo: string
  lngLat: [number, number]
}

// Unsplash CDN only — redirect-based hosts don't load reliably in this app.
// Every ID below is already proven elsewhere in the repo.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`

const JUST_BURGERS: Restaurant = {
  id: 'just-burgers',
  name: 'Just Burgers',
  tagline: 'Bustling spot for burgers & diner fare',
  rating: 4.3,
  reviewCount: 1213,
  price: '$10–20',
  openNote: 'Open',
  detourNote: '2 min away · Quick detour',
  photo: img('1504754524776-8f4f37790ca0'),
  lngLat: [-122.3287, 47.5813], // SODO
}

const ARASHI_RAMEN: Restaurant = {
  id: 'arashi-ramen',
  name: 'Arashi Ramen',
  tagline: 'Rich tonkotsu bowls, welcoming staff',
  rating: 4.4,
  reviewCount: 874,
  price: '$10–20',
  openNote: 'Open',
  detourNote: '4 min away',
  photo: img('1559305616-3f99cd43e353'),
  lngLat: [-122.4443, 47.2529], // Tacoma
}

const HUNGRY_PANDA: Restaurant = {
  id: 'hungry-panda',
  name: 'Hungry Panda',
  tagline: 'Family-style Sichuan off WA-16',
  rating: 4.4,
  reviewCount: 860,
  price: '$$',
  openNote: 'Open',
  detourNote: '2 min detour',
  photo: img('1481833761820-0509d3217039'),
  lngLat: [-122.6851, 47.5326], // Gorst
}

const MAMA_STORTINIS: Restaurant = {
  id: 'mama-stortinis',
  name: "Mama Stortini's",
  tagline: 'Italian comfort plates & warm booths',
  rating: 4.4,
  reviewCount: 1592,
  price: '$20–30',
  openNote: 'Open',
  detourNote: '6 min away',
  photo: img('1445116572660-236099ec97a0'),
  lngLat: [-122.6215, 47.3862], // Purdy
}

const PANDA_LA_CATRINA: Restaurant = {
  id: 'panda-la-catrina',
  name: 'Panda La Catrina',
  tagline: 'Patio seating, outdoor dining, friendly',
  rating: 4.2,
  reviewCount: 431,
  price: '$',
  openNote: 'Open',
  detourNote: '5 min away',
  photo: img('1509042239860-f550ce710b93'),
  lngLat: [-123.1462, 47.4048], // deck-only, no marker
}

/** Rating-pill markers shown on the map along the route. */
export const RESTAURANT_MARKERS: Restaurant[] = [
  JUST_BURGERS,
  ARASHI_RAMEN,
  HUNGRY_PANDA,
  MAMA_STORTINIS,
]

/** The list row featured in the results sheet (from the real GMaps screenshot). */
export const FEATURED_RESTAURANT = JUST_BURGERS

// ── Quick Decide deck ────────────────────────────────────────────────────────
export const DECK: Restaurant[] = [JUST_BURGERS, ARASHI_RAMEN, HUNGRY_PANDA, PANDA_LA_CATRINA]

/** Deck index whose right-swipe is scripted to match with Winnie. */
export const MATCH_INDEX = 2

export const MATCHED_WITH = { name: 'Winnie', avatar: WINNIE_AVATAR }

export const CARPLAY_SEND_MS = 2500

export const FILTER_CHIPS = ['Open now', 'Near me', 'Halfway', 'Near destination']
