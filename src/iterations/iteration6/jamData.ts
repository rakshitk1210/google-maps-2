import { MEMBER_AVATARS } from '../../shared/peopleAvatars'

export const DESTINATION_NAME = 'Mount Rainier'
export const KELLEY_DISPLAY_NAME = 'Kelley'
export const JAM_NAME = "Kelley's Jam"
export const JOINED_COUNT = 4

export const FULL_TRIP_DURATION = '2 hr 20 min'
export const FULL_TRIP_DISTANCE_ETA = '84 mi · 5:52 PM'
export const BANNER_DISTANCE = '200 m'
export const BANNER_INSTRUCTION = 'toward 11th Ave NE'

export const CARPLAY_CLOCK = '21:13'
export const COMPASS_LABEL = 'SW'
export const PHONE_CLOCK = '21:13'

export const NOTIFICATION_APP = 'Google Maps'
export const NOTIFICATION_TIME = 'now'
export const NOTIFICATION_TITLE = `${KELLEY_DISPLAY_NAME} invited you to join ${JAM_NAME}`
export const NOTIFICATION_BODY = `Trip to ${DESTINATION_NAME}`
export const JOINED_HEADLINE = `You've joined ${JAM_NAME}!`
export const JOINED_COUNT_LABEL = `${JOINED_COUNT} people`
export const JOINED_SUBLINE_REST = ' have joined Jam!!'

// The four Jam members. Index 0 is you (the phone user), index 1 is Kelley
// (the driver), then Josephine and Winnie — shared People on Roadtrip roster.
export const MEMBER_AVATAR_URLS = MEMBER_AVATARS

export const CAR_POSITION: [number, number] = [-122.3067, 47.6558]
export const MOUNT_RAINIER: [number, number] = [-121.7603, 46.8523]

// --- Ask Maps AI flow (phone), which re-routes both devices to a cafe stop ---

export const AI_USER_PROMPT = 'Find cafes along this route which are quirky'
export const AI_RESPONSE =
  'Found a couple of delightfully quirky cafes just off your route to Mount Rainier — Cafe Ladro is the closest, about 10 min ahead. Tap one to see details.'

export interface Cafe {
  id: string
  name: string
  tagline: string
  category: string
  priceRange: string
  rating: number
  reviewCount: number
  driveTime: string
  openNote: string
  description: string
  // "Know before you go" bullets, mirroring the real Maps place sheet.
  highlights: string[]
  // Coffee/food photos (Unsplash CDN — direct, no redirect, loads reliably).
  photos: string[]
  lngLat: [number, number]
}

// Unsplash images.unsplash.com is a direct CDN, so these load where the
// redirect-based picsum.photos did not. Sized/cropped via query params.
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`

export const CAFES: Cafe[] = [
  {
    id: 'cafe-ladro',
    name: 'Cafe Ladro',
    tagline: 'Quirky espresso bar · 10 min away',
    category: 'Cafe',
    priceRange: '$20–30',
    rating: 4.9,
    reviewCount: 214,
    driveTime: '10 min',
    openNote: 'Open · Closes 6 PM',
    description:
      'A beloved Seattle institution pulling silky espresso since 1994. Mismatched vintage armchairs, a resident cafe cat named Miso, and a rotating wall of local art make it a wonderfully quirky perch just off your route. Organic pastries are baked in-house every morning, and there is a small natural-wine list for the afternoon crowd.',
    highlights: [
      'Regulars rave about the honey-lavender latte',
      'Cozy vintage seating and a resident cafe cat',
      'House-made almond croissants sell out by noon',
    ],
    photos: [
      img('1495474472287-4d71bcdd2085'),  // latte art overhead
      img('1509440159596-0249088772ff'),  // espresso close-up
      img('1445116572660-236099ec97a0'),  // cafe interior warm light
      img('1509042239860-f550ce710b93'),  // pastries spread
      img('1497935586351-b67a49e012bf'),  // cappuccino with foam art
      img('1514066558159-fc8c737ef259'),  // croissant and coffee
    ],
    lngLat: [-122.3321, 47.6142],
  },
  {
    id: 'analog',
    name: 'Analog Coffee',
    tagline: 'Retro vinyl cafe · 14 min away',
    category: 'Coffee shop',
    priceRange: '$10–20',
    rating: 4.7,
    reviewCount: 180,
    driveTime: '14 min',
    openNote: 'Open · Closes 5 PM',
    description:
      'Part record shop, part roastery — crates of vinyl line the walls, neon glows over the bar, and the pour-overs are meticulously dialed in. A slightly longer detour that regulars swear by for the offbeat vibe, the seasonal single-origin flights, and a sunny corner that fills up on weekends.',
    highlights: [
      'Known for its rotating single-origin pour-overs',
      'Flip through crates of vinyl while you wait',
      'Weekend crowd loves the sourdough breakfast plate',
    ],
    photos: [
      img('1461023058943-07fcbe16d735'),  // pour-over drip
      img('1481833761820-0509d3217039'),  // cozy cafe interior
      img('1504754524776-8f4f37790ca0'),  // brunch plate overhead
      img('1533089860892-a7c6f0a88666'),  // coffee beans close-up
      img('1442512595331-e89e73853f31'),  // vinyl records + coffee
      img('1559305616-3f99cd43e353'),     // sourdough toast plate
    ],
    lngLat: [-122.321, 47.619],
  },
]

// The cafe stop replaces the Mount Rainier drive once the phone sends it to the
// car (banner + ETA on both devices swap to these values).
export const CAFE_TRIP_DURATION = '10 min'
export const CAFE_TRIP_DISTANCE_ETA = '3.2 mi · 5:03 PM'
export const CAFE_BANNER_DISTANCE = '500 ft'
export const CAFE_BANNER_INSTRUCTION = 'to Cafe Ladro'

// Shared flow state for the dual-device Jam interaction.
export type JamFlow = 'idle' | 'inviteSent' | 'notified' | 'joined'

// Which destination both devices are navigating to. Sending a cafe from the
// phone flips this from 'destination' (Mount Rainier) to 'cafe' (Cafe Ladro).
export type RouteTarget = 'destination' | 'cafe'
