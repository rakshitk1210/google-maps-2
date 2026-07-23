// Iteration 15 — the "Ask Maps" AI search inside the shared itinerary. One
// scripted exchange: a complex food query answered with two taco restaurant picks
// along the drive to Olympic National Park. Photos are Unsplash assets for Mexican
// and taco cuisine.

import { CONTRIBUTORS, type TripPlace } from './tripData'

// Unsplash CDN for taco restaurant imagery
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`

export const ASK_PLACEHOLDER = 'Find restaurants'

// The demo query from the Figma flow — typed by the user, echoed as the bubble.
export const ASK_DEMO_QUERY = 'Best tacos nearby'

export const ASK_RESPONSE =
  'Discovered 2 fantastic taco spots on your way to Olympic National Park — El Taco Fresco is the nearest, roughly 25 minutes ahead. Tap one for more details.'

// Two taco restaurants aren't on the shared list — Ask Maps surfaces them fresh. They
// still carry the full TripPlace shape so RoutePreview / nav work untouched.
export const EL_TACO_FRESCO: TripPlace = {
  id: 'el-taco-fresco',
  name: 'El Taco Fresco',
  category: 'Restaurants',
  detail: 'Street tacos · Authentic Mexican · Tacoma',
  rating: 4.8,
  reviewCount: 512,
  markedBy: CONTRIBUTORS[1], // Kelley
  photo: img('1565299585323-38d6b0865b47'), // lime squeezed over street tacos
  lngLat: [-122.4443, 47.2379],
  driveTime: '25 min',
  arriveTime: 'Arrive 2:25 PM',
  tripMeta: '30 mi · 2:25 PM',
  bannerRoad: 'WA-16 W',
}

export const BAJA_FISH_TACOS: TripPlace = {
  id: 'baja-fish-tacos',
  name: 'Baja Fish Tacos',
  category: 'Restaurants',
  detail: 'Fresh fish tacos · Hood Canal · Shelton',
  rating: 4.7,
  reviewCount: 445,
  markedBy: CONTRIBUTORS[3], // Winnie
  photo: img('1551504734-5ee1c4a1479b'), // top-down tacos on a plate
  lngLat: [-123.1, 47.2154],
  driveTime: '55 min',
  arriveTime: 'Arrive 2:55 PM',
  tripMeta: '58 mi · 2:55 PM',
  bannerRoad: 'US-101 N',
}

export interface AskResult {
  place: TripPlace
  subtitle: string
  photos: [string, string, string]
}

export const ASK_RESULTS: AskResult[] = [
  {
    place: EL_TACO_FRESCO,
    subtitle: 'Street tacos · 25 min away',
    photos: [
      img('1565299585323-38d6b0865b47'), // lime squeezed over street tacos
      img('1552332386-f8dd00dc2f85'), // street tacos with radish
      img('1512838243191-e81e8f66f1fd'), // gourmet tacos on a board
    ],
  },
  {
    place: BAJA_FISH_TACOS,
    subtitle: 'Fresh fish tacos · 45 min away',
    photos: [
      img('1551504734-5ee1c4a1479b'), // top-down tacos on a plate
      img('1611250188496-e966043a0629'), // tacos on white plate with lime
      img('1613514785940-daed07799d9b'), // tacos with beer
    ],
  },
]
