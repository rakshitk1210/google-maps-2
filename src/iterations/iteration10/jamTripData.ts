import { WINNIE_AVATAR, MEMBER_AVATARS } from '../../shared/peopleAvatars'

export { MEMBER_AVATARS }

// ── The jam ──────────────────────────────────────────────────────────────────
export const JAM_NAME = "Kelley's Jam"
export const KELLEY_DISPLAY_NAME = 'Kelley'

// ── Geography ────────────────────────────────────────────────────────────────
// The jam is northbound on I-5 near NE 50th St in Seattle, headed to
// Bellingham. Sits on the freeway itself so Directions keeps the route on I-5.
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
  name: 'Bellingham',
  lngLat: [-122.4787, 48.7519],
  duration: '1 hr 55 min',
  meta: '86 mi · 8:12 PM',
  bannerRoad: 'I-5 N',
  arriveTime: 'Arrive 8:12 PM',
}

// Where the drive lands after the jam matches on Hungry Panda.
export const MATCH_NAV: NavDestination = {
  name: 'Hungry Panda',
  lngLat: [-122.284, 47.829],
  duration: '21 min',
  meta: '14 mi · 6:34 PM',
  bannerRoad: 'Exit 181',
  arriveTime: 'Arrive 6:34 PM',
}

export const ORIGIN_LABEL = 'Current location · I-5 N'

// Rough I-5 N spine (Seattle → Bellingham) so the demo never shows a bare map
// if the Directions API fails.
export const FALLBACK_ROUTE: [number, number][] = [
  [-122.3219, 47.664],
  [-122.328, 47.706],
  [-122.315, 47.787],
  [-122.285, 47.83],
  [-122.22, 47.98],
  [-122.33, 48.2],
  [-122.335, 48.44],
  [-122.4787, 48.7519],
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
  lngLat: [-122.323, 47.708], // Northgate
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
  lngLat: [-122.312, 47.787], // Mountlake Terrace
}

const HUNGRY_PANDA: Restaurant = {
  id: 'hungry-panda',
  name: 'Hungry Panda',
  tagline: 'Family-style Sichuan off Exit 181',
  rating: 4.4,
  reviewCount: 860,
  price: '$$',
  openNote: 'Open',
  detourNote: '2 min detour',
  photo: img('1481833761820-0509d3217039'),
  lngLat: [-122.284, 47.829], // Lynnwood
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
  lngLat: [-122.221, 47.889], // Ash Way / Everett
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
  lngLat: [-122.202, 47.978], // deck-only, no marker
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
