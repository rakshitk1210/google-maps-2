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

// Truncated spine for the Gemini trip's first leg (Seattle → Snow Goose).
export const FALLBACK_TO_NEXT_STOP: [number, number][] = [
  [-122.3321, 47.6062],
  [-122.328, 47.706],
  [-122.315, 47.787],
  [-122.285, 47.83],
  [-122.22, 47.98],
  [-122.33, 48.2],
  [-122.407, 48.354],
]

export const BANNER_TOWARD = 'toward'
export const THEN_LABEL = 'Then'

// ── The Gemini plan ──────────────────────────────────────────────────────────
// Rule of thumb: about one stop per 50 miles — a 142-mile trip gets 4.
export interface TripStop {
  id: string
  name: string
  note: string
  kind: 'scenic' | 'food'
  photo: string
  lngLat: [number, number]
  milesFromStart: number
}

// Unsplash CDN only — redirect-based hosts don't load reliably in this app.
// Every ID below is already proven elsewhere in the repo. Markers request a
// small crop (w=160) so four photo pins never jank the pop-in.
const img = (id: string, w = 500) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${w > 200 ? 70 : 60}`

export const STOPS: TripStop[] = [
  {
    id: 'snow-goose',
    name: 'Snow Goose Produce',
    note: 'Legendary farm-stand ice cream',
    kind: 'food',
    photo: img('1509440159596-0249088772ff'),
    lngLat: [-122.407, 48.354],
    milesFromStart: 58,
  },
  {
    id: 'tulip-town',
    name: 'Tulip Town',
    note: 'Skagit Valley flower fields',
    kind: 'scenic',
    photo: img('1472214103451-9374bd1c798e'),
    lngLat: [-122.398, 48.466],
    milesFromStart: 65,
  },
  {
    id: 'chuckanut',
    name: 'Chuckanut Overlook',
    note: 'Cliffside views over Samish Bay',
    kind: 'scenic',
    photo: img('1501785888041-af3ef285b470'),
    lngLat: [-122.491, 48.653],
    milesFromStart: 80,
  },
  {
    id: 'peace-arch',
    name: 'Peace Arch Park',
    note: 'Walk the US–Canada border garden',
    kind: 'scenic',
    photo: img('1506744038136-46273834b3fb'),
    lngLat: [-122.756, 49.002],
    milesFromStart: 110,
  },
]

/** Small crop of a stop's photo for its map marker. */
export const stopMarkerPhoto = (stop: TripStop) => stop.photo.replace('w=500', 'w=160').replace('q=70', 'q=60')

export const NEXT_STOP = STOPS[0]

// Nav chrome when the Gemini road trip is active — driving to stop 1, not Vancouver.
export const NEXT_STOP_NAV: NavDestination = {
  name: NEXT_STOP.name,
  lngLat: NEXT_STOP.lngLat,
  duration: '1 hr 5 min',
  meta: `${NEXT_STOP.milesFromStart} mi · 5:10 PM`,
  bannerRoad: 'I-5 N',
  arriveTime: 'Arrive 5:10 PM',
}

export const NEXT_STOP_NAV_ETA = { duration: '1 hr 2 min', meta: '56 mi · 5:08 PM' }

export const SHEET_TITLE = 'Seattle → Vancouver Roadtrip'
export const SHEET_SUBTITLE = ' · 4 stops · +38 min'
export const CHIP_TITLE = 'SEA → VAN Road Trip'
export const CHIP_NEXT = `Next: ${NEXT_STOP.name} · ${NEXT_STOP.milesFromStart} mi`
