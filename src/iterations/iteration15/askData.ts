// Iteration 15 — the "Ask Maps" AI search inside the shared itinerary. One
// scripted exchange: a complex food query answered with two cafe picks along
// the drive. Photos are the exact crops from the Figma frames, committed as
// local assets (the MCP asset URLs expire).

import { CONTRIBUTORS, TRIP_PLACES, type TripPlace } from './tripData'
import ladro1 from './assets/ladro-1.jpg'
import ladro2 from './assets/ladro-2.jpg'
import ladro3 from './assets/ladro-3.jpg'
import herkimer1 from './assets/herkimer-1.jpg'
import herkimer2 from './assets/herkimer-2.jpg'
import herkimer3 from './assets/herkimer-3.jpg'

export const ASK_PLACEHOLDER = 'Find restaurants'

// The demo query from the Figma flow — typed by the user, echoed as the bubble.
export const ASK_DEMO_QUERY = 'Food 10 min detour, no egg'

export const ASK_RESPONSE =
  'Discovered 2 fantastic cafes on your way to Skagit Valley — Cafe Ladro is the nearest, roughly 30 minutes ahead with a 10-minute detour. Tap one for more details.'

// Herkimer Coffee isn't on the shared list — Ask Maps surfaces it fresh. It
// still carries the full TripPlace shape so RoutePreview / nav work untouched.
export const HERKIMER_COFFEE: TripPlace = {
  id: 'herkimer-coffee',
  name: 'Herkimer Coffee',
  category: 'Cafe',
  detail: 'Neighborhood roaster · Greenwood',
  rating: 4.7,
  reviewCount: 389,
  markedBy: CONTRIBUTORS[2], // Josephine
  photo: herkimer1,
  lngLat: [-122.3553, 47.6908],
  driveTime: '35 min',
  arriveTime: 'Arrive 5:43 PM',
  tripMeta: '9 mi · 5:43 PM',
  bannerRoad: 'Aurora Ave N',
}

export interface AskResult {
  place: TripPlace
  subtitle: string
  photos: [string, string, string]
}

export const ASK_RESULTS: AskResult[] = [
  {
    place: TRIP_PLACES.find((place) => place.id === 'cafe-ladro')!,
    subtitle: 'Cozy espresso bar · 20 min away',
    photos: [ladro1, ladro2, ladro3],
  },
  {
    place: HERKIMER_COFFEE,
    subtitle: 'Neighborhood roaster · 35 min away',
    photos: [herkimer1, herkimer2, herkimer3],
  },
]
