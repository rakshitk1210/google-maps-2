import { JOSEPHINE_AVATAR, WINNIE_AVATAR, KELLEY_AVATAR } from '../../shared/peopleAvatars'

// ── Geography ────────────────────────────────────────────────────────────────
// A Seattle → Vancouver drive (~142 mi), the canvas for the Gemini-planned
// road trip.
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
  name: 'Vancouver',
  lngLat: [-123.1207, 49.2827],
  duration: '4 hr 55 min',
  meta: '142 mi · 7:40 PM',
  bannerRoad: 'I-5 N',
  arriveTime: 'Arrive 7:40 PM',
}

// Slightly-elapsed ETA once driving straight to Vancouver.
export const NAV_ETA = { duration: '4 hr 30 min', meta: '138 mi · 7:38 PM' }

// Rough I-5 N spine (Seattle → Vancouver) so the demo never shows a bare map
// if the Directions API fails.
export const FALLBACK_ROUTE: [number, number][] = [
  [-122.3321, 47.6062],
  [-122.328, 47.706],
  [-122.315, 47.787],
  [-122.285, 47.83],
  [-122.22, 47.98],
  [-122.33, 48.2],
  [-122.335, 48.44],
  [-122.485, 48.79],
  [-122.74, 48.99],
  [-123.03, 49.12],
  [-123.1207, 49.2827],
]

// Truncated I-5 spine for any first-leg destination (Seattle → chosen stop or
// Vancouver), used only if the Directions API fails.
export function fallbackToDest(dest: [number, number]): [number, number][] {
  const pts = FALLBACK_ROUTE.filter((p) => p[1] < dest[1] - 0.01)
  return [...pts, dest]
}

export const BANNER_TOWARD = 'toward'
export const THEN_LABEL = 'Then'

// ── The Gemini plan ──────────────────────────────────────────────────────────
// Rule of thumb: about one stop per 50 miles — a 142-mile trip gets 4. Each
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
    id: 'snow-goose',
    name: 'Snow Goose Produce',
    note: 'Legendary farm-stand ice cream',
    kind: 'food',
    category: 'Farm stand',
    rating: 4.8,
    reviewCount: 1547,
    priceRange: '$$',
    openNote: 'Open · Closes 6 PM',
    description:
      'A beloved Skagit Valley farm stand famous for its "immodest" ice cream cones, just-picked local produce, and fresh oysters. The perfect first stretch-your-legs stop heading north.',
    highlights: [
      'Order the "immodest" single — it\'s enormous',
      'Local berries and sweet corn in summer',
      'Cash and card both accepted',
    ],
    photo: img('1509440159596-0249088772ff'),
    photos: gallery(
      '1509440159596-0249088772ff',
      '1509042239860-f550ce710b93',
      '1504754524776-8f4f37790ca0',
      '1514066558159-fc8c737ef259',
      '1445116572660-236099ec97a0',
    ),
    lngLat: [-122.407, 48.354],
    milesFromStart: 58,
    etaDuration: '1 hr 5 min',
    arriveAt: '5:10 PM',
  },
  {
    id: 'tulip-town',
    name: 'Tulip Town',
    note: 'Skagit Valley flower fields',
    kind: 'scenic',
    category: 'Tulip fields',
    rating: 4.7,
    reviewCount: 986,
    priceRange: '$15 entry',
    openNote: 'Open · Seasonal (April)',
    description:
      'Sprawling tulip fields in the heart of Skagit Valley. Wander rows of color, snap photos by the windmill, and grab a few bulbs to take home.',
    highlights: [
      'Peak bloom is early-to-mid April',
      'Covered trolley tours available',
      'Weekdays are far less crowded',
    ],
    photo: img('1472214103451-9374bd1c798e'),
    photos: gallery(
      '1472214103451-9374bd1c798e',
      '1531091881557-e0b21c6c56b9',
      '1501785888041-af3ef285b470',
      '1506744038136-46273834b3fb',
    ),
    lngLat: [-122.398, 48.466],
    milesFromStart: 65,
    etaDuration: '1 hr 12 min',
    arriveAt: '5:18 PM',
  },
  {
    id: 'chuckanut',
    name: 'Chuckanut Overlook',
    note: 'Cliffside views over Samish Bay',
    kind: 'scenic',
    category: 'Scenic viewpoint',
    rating: 4.8,
    reviewCount: 517,
    priceRange: 'Free',
    openNote: 'Open · 24 hrs',
    description:
      'A cliffside pullout on Chuckanut Drive with sweeping views over Samish Bay and the San Juan Islands. Best light at golden hour.',
    highlights: [
      'Small pullout — arrive early on weekends',
      'Sunset views out over the islands',
      'Larrabee State Park trailheads nearby',
    ],
    photo: img('1501785888041-af3ef285b470'),
    photos: gallery(
      '1501785888041-af3ef285b470',
      '1531091881557-e0b21c6c56b9',
      '1506744038136-46273834b3fb',
      '1472214103451-9374bd1c798e',
    ),
    lngLat: [-122.491, 48.653],
    milesFromStart: 80,
    etaDuration: '1 hr 30 min',
    arriveAt: '5:36 PM',
  },
  {
    id: 'peace-arch',
    name: 'Peace Arch Park',
    note: 'Walk the US–Canada border garden',
    kind: 'scenic',
    category: 'Border garden park',
    rating: 4.7,
    reviewCount: 2043,
    priceRange: 'Free',
    openNote: 'Open · 8 AM – 10 PM',
    description:
      'A manicured garden park straddling the US–Canada border, built around the historic Peace Arch. Stroll between two countries without a passport (within the park itself).',
    highlights: [
      'Walk freely between the US and Canada inside the park',
      'Bring a picnic — lots of open lawn',
      'Carry ID if you\'re continuing across the border',
    ],
    photo: img('1506744038136-46273834b3fb'),
    photos: gallery(
      '1506744038136-46273834b3fb',
      '1531091881557-e0b21c6c56b9',
      '1501785888041-af3ef285b470',
      '1472214103451-9374bd1c798e',
    ),
    lngLat: [-122.756, 49.002],
    milesFromStart: 110,
    etaDuration: '2 hr 2 min',
    arriveAt: '6:08 PM',
  },
]

/** Small crop of a stop's photo for its map marker. */
export const stopMarkerPhoto = (stop: TripStop) => stop.photo.replace('w=500', 'w=160').replace('q=70', 'q=60')

/** Nav chrome for driving to a given stop first (instead of straight to Vancouver). */
export function navForStop(stop: TripStop): NavDestination {
  return {
    name: stop.name,
    lngLat: stop.lngLat,
    duration: stop.etaDuration,
    meta: `${stop.milesFromStart} mi · ${stop.arriveAt}`,
    bannerRoad: 'I-5 N',
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

export const SHEET_TITLE = 'Seattle → Vancouver Roadtrip'
export const SHEET_SUBTITLE = ' · 4 stops · +38 min'
export const CHIP_TITLE = 'SEA → VAN Road Trip'
export const CHIP_NEXT = chipNextForStop(NEXT_STOP)
