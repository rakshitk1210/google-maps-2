import { JOSEPHINE_AVATAR, WINNIE_AVATAR, KELLEY_AVATAR } from '../../shared/peopleAvatars'

// ── Geography ────────────────────────────────────────────────────────────────
// A Seattle → Olympic National Park drive (~147 mi), the canvas for the
// Gemini-planned road trip.
export const SEATTLE_ORIGIN: [number, number] = [-122.3321, 47.6062]
export const ORIGIN_LABEL = 'Seattle'
export const NAV_ZOOM = 15.6

export interface NavDestination {
  name: string
  lngLat: [number, number]
  duration: string
  meta: string
  bannerRoad: string
  arriveTime: string
}

export const TRIP_DEST: NavDestination = {
  name: 'Olympic National Park',
  lngLat: [-123.4993, 47.9686],
  duration: '4 hr 55 min',
  meta: '147 mi · 7:40 PM',
  bannerRoad: 'US-101 W',
  arriveTime: 'Arrive 7:40 PM',
}

// Slightly-elapsed ETA once driving straight to Olympic National Park.
export const NAV_ETA = { duration: '4 hr 30 min', meta: '143 mi · 7:38 PM' }

// Rough WA-16 / US-101 spine (Seattle → Hurricane Ridge) so the demo never
// shows a bare map if the Directions API fails.
export const FALLBACK_ROUTE: [number, number][] = [
  [-122.3321, 47.6062],
  [-122.4416, 47.4235],
  [-122.5514, 47.2707],
  [-122.6335, 47.3204],
  [-122.9004, 47.2265],
  [-123.1007, 47.2151],
  [-123.1462, 47.4048],
  [-123.0917, 47.5211],
  [-122.9412, 47.8483],
  [-123.0034, 48.0721],
  [-123.4307, 48.1181],
  [-123.4993, 47.9686],
]

// Truncated WA-16 / US-101 spine for any first-leg destination (Seattle →
// chosen stop or the park), used only if the Directions API fails. US-101
// hooks back east around Hood Canal, so the spine isn't monotonic in either
// axis — trim at the spine point nearest the destination instead.
export function fallbackToDest(dest: [number, number]): [number, number][] {
  const sq = (p: [number, number]) => (p[0] - dest[0]) ** 2 + (p[1] - dest[1]) ** 2
  let nearest = 0
  FALLBACK_ROUTE.forEach((p, i) => {
    if (sq(p) < sq(FALLBACK_ROUTE[nearest])) nearest = i
  })
  return [...FALLBACK_ROUTE.slice(0, nearest), dest]
}

export const BANNER_TOWARD = 'toward'
export const THEN_LABEL = 'Then'

// ── The Gemini plan ──────────────────────────────────────────────────────────
// Rule of thumb: about one stop per 50 miles — a 147-mile trip gets 4. Each
// stop carries enough detail to power its own place page (photos, reviews,
// directions), reusing the pattern from earlier iterations.
export interface TripStop {
  id: string
  name: string
  note: string
  kind: 'scenic' | 'food'
  category: string
  rating: number
  reviewCount: number
  priceRange: string
  openNote: string
  description: string
  highlights: string[]
  photo: string
  photos: string[]
  lngLat: [number, number]
  milesFromStart: number
  /** Drive time from Seattle if this is picked as the first stop. */
  etaDuration: string
  /** Arrival clock time if picked as the first stop. */
  arriveAt: string
}

// Unsplash CDN only — redirect-based hosts don't load reliably in this app.
// Every ID below is already proven elsewhere in the repo. Markers request a
// small crop (w=160) so four photo pins never jank the pop-in.
const img = (id: string, w = 500) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${w > 200 ? 70 : 60}`

const gallery = (...ids: string[]) => ids.map((id) => img(id, 800))

export const STOPS: TripStop[] = [
  {
    id: 'tacoma-narrows',
    name: 'Tacoma Narrows Bridge Viewpoint',
    note: 'Suspension-bridge lookout',
    kind: 'scenic',
    category: 'Scenic viewpoint',
    rating: 4.7,
    reviewCount: 612,
    priceRange: 'Free',
    openNote: 'Open · 24 hrs',
    description:
      'A lookout in Narrows Park with the twin suspension bridges filling the view across the strait. The first natural pull-off once the drive leaves I-5 for the peninsula.',
    highlights: [
      'Both bridge spans framed from one bench',
      'Short paved path down to the water',
      'Free parking, rarely full on weekdays',
    ],
    photo: img('1476231682828-37e571bc172f'),
    photos: gallery(
      '1476231682828-37e571bc172f',
      '1506905925346-21bda4d32df4',
      '1470770903676-69b98201ea1c',
      '1441974231531-c6227db76b6e',
    ),
    lngLat: [-122.5514, 47.2707],
    milesFromStart: 35,
    etaDuration: '45 min',
    arriveAt: '4:50 PM',
  },
  {
    id: 'hama-hama-oyster-saloon',
    name: 'Hama Hama Oyster Saloon',
    note: 'Roadside oysters on Hood Canal',
    kind: 'food',
    category: 'Oyster bar',
    rating: 4.8,
    reviewCount: 1342,
    priceRange: '$$',
    openNote: 'Open · Closes 6 PM',
    description:
      'A working oyster farm with picnic tables right on Hood Canal. Order at the window, grab a tray, and eat with the water a few feet away. The obvious lunch stop on the way up US-101.',
    highlights: [
      'Grilled oysters are the thing to order',
      'Bring a jacket — seating is all outdoors',
      'Farm store sells shellfish to take home',
    ],
    photo: img('1615141982883-c7ad0e69fd62'),
    photos: gallery(
      '1615141982883-c7ad0e69fd62',
      '1414235077428-338989a2e8c0',
      '1501339847302-ac426a4a7cbb',
      '1470770903676-69b98201ea1c',
    ),
    lngLat: [-123.0917, 47.5211],
    milesFromStart: 80,
    etaDuration: '1 hr 40 min',
    arriveAt: '5:45 PM',
  },
  {
    id: 'sequim-bay-state-park',
    name: 'Sequim Bay State Park',
    note: 'Bayside stretch-your-legs stop',
    kind: 'scenic',
    category: 'State park',
    rating: 4.6,
    reviewCount: 388,
    priceRange: 'Discover Pass',
    openNote: 'Open · 8 AM – dusk',
    description:
      'A sheltered bay with picnic tables, a boat launch, and flat trails through the trees. The last easy stretch break before the climb toward the park.',
    highlights: [
      'Protected bay — calm even when the strait is rough',
      'Discover Pass required to park',
      'Short loop trail under second-growth firs',
    ],
    photo: img('1444492417251-9c84a5fa18e0'),
    photos: gallery(
      '1444492417251-9c84a5fa18e0',
      '1476673160081-cf065607f449',
      '1441974231531-c6227db76b6e',
      '1518173946687-a4c8892bbd9f',
    ),
    lngLat: [-123.0034, 48.0721],
    milesFromStart: 118,
    etaDuration: '2 hr 40 min',
    arriveAt: '6:45 PM',
  },
  {
    id: 'downriggers-waterfront',
    name: 'Downriggers on the Waterfront',
    note: 'Harbor-view seafood in Port Angeles',
    kind: 'food',
    category: 'Seafood grill',
    rating: 4.5,
    reviewCount: 1876,
    priceRange: '$$',
    openNote: 'Open · Closes 9 PM',
    description:
      'A seafood grill over Port Angeles harbor, with the ferry dock and the strait out the windows. The last real dinner option before the road climbs to Hurricane Ridge.',
    highlights: [
      'Ask for a window table facing the harbor',
      'Chowder and the fish of the day are the safe orders',
      'Ten minutes from the Hurricane Ridge turn-off',
    ],
    photo: img('1414235077428-338989a2e8c0'),
    photos: gallery(
      '1414235077428-338989a2e8c0',
      '1552566626-52f8b828add9',
      '1615141982883-c7ad0e69fd62',
      '1476673160081-cf065607f449',
    ),
    lngLat: [-123.4307, 48.1181],
    milesFromStart: 130,
    etaDuration: '3 hr 5 min',
    arriveAt: '7:10 PM',
  },
]

/** Small crop of a stop's photo for its map marker. */
export const stopMarkerPhoto = (stop: TripStop) => stop.photo.replace('w=500', 'w=160').replace('q=70', 'q=60')

/** Nav chrome for driving to a given stop first (instead of straight to the park). */
export function navForStop(stop: TripStop): NavDestination {
  return {
    name: stop.name,
    lngLat: stop.lngLat,
    duration: stop.etaDuration,
    meta: `${stop.milesFromStart} mi · ${stop.arriveAt}`,
    bannerRoad: 'US-101 N',
    arriveTime: `Arrive ${stop.arriveAt}`,
  }
}

/** Bottom-bar ETA when actively driving to a stop. */
export const navEtaForStop = (stop: TripStop) => ({
  duration: stop.etaDuration,
  meta: `${stop.milesFromStart} mi · ${stop.arriveAt}`,
})

/** Chip / status-line "next stop" label for a given stop. */
export const chipNextForStop = (stop: TripStop) => `Next: ${stop.name} · ${stop.milesFromStart} mi`

export const NEXT_STOP = STOPS[0]

// Generic reviews reused across the stop detail pages (demo content).
export interface StopReview {
  name: string
  avatar: string
  rating: number
  text: string
}

export const SAMPLE_REVIEWS: StopReview[] = [
  {
    name: 'Josephine',
    avatar: JOSEPHINE_AVATAR,
    rating: 5,
    text: 'Exactly the kind of stop that makes a road trip. Worth the quick detour off the highway.',
  },
  {
    name: 'Winnie',
    avatar: WINNIE_AVATAR,
    rating: 5,
    text: 'Loved it — go earlier in the day to beat the crowds and get the best light.',
  },
  {
    name: 'Kelley',
    avatar: KELLEY_AVATAR,
    rating: 4,
    text: 'Great spot to stretch your legs. Parking fills up on weekends, so plan ahead.',
  },
]

export const SHEET_TITLE = 'Seattle → Olympic National Park Roadtrip'
export const SHEET_SUBTITLE = ' · 4 stops · +38 min'
export const CHIP_TITLE = 'SEA → ONP Road Trip'
export const CHIP_NEXT = chipNextForStop(NEXT_STOP)
