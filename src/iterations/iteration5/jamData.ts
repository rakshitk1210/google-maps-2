import { KELLEY_AVATAR, YOU_AVATAR } from '../../shared/peopleAvatars'

export const DESTINATION_NAME = 'Mount Rainier'
export const KYLE_DISPLAY_NAME = 'Kelley'
export const FULL_TRIP_DURATION = '2 hr 20 min'
export const FULL_TRIP_DISTANCE_ETA = '84 mi · 5:52 PM'
export const BANNER_INSTRUCTION = 'toward 11th Ave NE'
export const YOUR_AVATAR_URL = YOU_AVATAR
export const KYLE_AVATAR_URL = KELLEY_AVATAR
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
  photos: string[]
  lngLat: [number, number]
}

// Unsplash CDN — same coffee/food set proven in iteration 6 (picsum redirects
// load unreliably and don't match cafe content).
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`

export const CAFES: Cafe[] = [
  {
    id: 'cafe-ladro',
    name: 'Cafe Ladro',
    tagline: 'Cozy espresso bar · 20 min away',
    description:
      'A Seattle classic pulling smooth espresso shots since 1994. Quick street parking and a pastry case worth the stop, just off your route downtown.',
    reviews: '★ 5.0 · 5 reviews',
    awayNote: '20 min away',
    photos: [
      img('1495474472287-4d71bcdd2085'), // latte art overhead
      img('1509440159596-0249088772ff'), // espresso close-up
      img('1445116572660-236099ec97a0'), // cafe interior warm light
      img('1509042239860-f550ce710b93'), // pastries spread
      img('1497935586351-b67a49e012bf'), // cappuccino with foam art
      img('1514066558159-fc8c737ef259'), // croissant and coffee
    ],
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
    photos: [
      img('1461023058943-07fcbe16d735'), // pour-over drip
      img('1481833761820-0509d3217039'), // cozy cafe interior
      img('1504754524776-8f4f37790ca0'), // brunch plate overhead
      img('1533089860892-a7c6f0a88666'), // coffee beans close-up
      img('1442512595331-e89e73853f31'), // vinyl records + coffee
      img('1559305616-3f99cd43e353'), // sourdough toast plate
    ],
    lngLat: [-122.355, 47.565],
  },
]
