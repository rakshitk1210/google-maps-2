export const DESTINATION_NAME = 'Mount Rainier'
export const KYLE_DISPLAY_NAME = 'Kyle'
export const FULL_TRIP_DURATION = '2 hr 20 min'
export const FULL_TRIP_DISTANCE_ETA = '84 mi · 5:52 PM'
export const BANNER_INSTRUCTION = 'toward 11th Ave NE'
export const YOUR_AVATAR_SEED = 'you'
export const KYLE_AVATAR_SEED = 'kyle'
export const CAR_POSITION: [number, number] = [-122.3067, 47.6558]
export const MOUNT_RAINIER: [number, number] = [-121.7603, 46.8523]

export const CAFE_BANNER_INSTRUCTION = '100 ft'
export const NEAREST_CAFE_DURATION = '20 min'
export const NEAREST_CAFE_DISTANCE_ETA = '7.5 mi · 3:55 PM'

export const AI_USER_PROMPT = 'Find cafes along the route'
export const AI_RESPONSE =
  'Found 2 great cafes along your route to Mount Rainier — Cafe Ladro is the closest, about 20 min ahead. Tap one to see details.'

export interface Cafe {
  id: string
  name: string
  tagline: string
  description: string
  reviews: string
  awayNote: string
  lngLat: [number, number]
}

export const CAFES: Cafe[] = [
  {
    id: 'cafe-ladro',
    name: 'Cafe Ladro',
    tagline: 'Cozy espresso bar · 20 min away',
    description:
      'A Seattle classic pulling smooth espresso shots since 1994. Quick street parking and a pastry case worth the stop, just off your route downtown.',
    reviews: '★ 5.0 · 5 reviews',
    awayNote: '20 min away',
    lngLat: [-122.3321, 47.6142],
  },
  {
    id: 'herkimer',
    name: 'Herkimer Coffee',
    tagline: 'Neighborhood roaster · 35 min away',
    description:
      'Small-batch roaster known for balanced pour-overs and a calm room. A slightly longer detour, but a favorite among locals heading south.',
    reviews: '★ 4.8 · 320 reviews',
    awayNote: '35 min away',
    lngLat: [-122.355, 47.565],
  },
]
