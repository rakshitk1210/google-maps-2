// Iteration 15 — the shared "Roadtrip to Olympic National Park" itinerary. The
// fam curates places along the drive west; each one is tagged with who marked
// it so the list reads as a group effort. Coordinates are real Washington
// spots along US-101 from the U District toward the Olympic Peninsula.

import {
  JOSEPHINE_AVATAR,
  KELLEY_AVATAR,
  WINNIE_AVATAR,
  YOU_AVATAR,
} from '../../shared/peopleAvatars'

export { YOU_AVATAR, KELLEY_AVATAR, JOSEPHINE_AVATAR, WINNIE_AVATAR }

export const TRIP_TITLE = 'Olympic National Park'

/** Trip origin — U District, Seattle (iteration 7's map center). */
export const ORIGIN: [number, number] = [-122.3067, 47.6558]
export const ORIGIN_LABEL = 'University District'
export const HOME_ZOOM = 15.2
export const NAV_ZOOM = 15.6

export interface Contributor {
  name: string
  avatar: string
}

export const CONTRIBUTORS: Contributor[] = [
  { name: 'You', avatar: YOU_AVATAR },
  { name: 'Kelley', avatar: KELLEY_AVATAR },
  { name: 'Josephine', avatar: JOSEPHINE_AVATAR },
  { name: 'Winnie', avatar: WINNIE_AVATAR },
]

export type PlaceCategory = 'Restaurants' | 'Cafe' | 'Nature' | 'Rest' | 'Viewpoint'

// Reordered per the iteration 13 sketch so All / Nature / Restaurants lead.
export const CATEGORIES: Array<'All' | PlaceCategory> = [
  'All',
  'Nature',
  'Restaurants',
  'Cafe',
  'Viewpoint',
  'Rest',
]

export interface TripPlace {
  id: string
  name: string
  category: PlaceCategory
  detail: string
  rating: number
  reviewCount: number
  markedBy: Contributor
  photo: string
  lngLat: [number, number]
  driveTime: string
  arriveTime: string
  /** Meta line for the nav bottom bar, e.g. "18 mi · 5:55 PM". */
  tripMeta: string
  /** Road name shown in the nav instruction banner. */
  bannerRoad: string
}

// Unsplash CDN only — redirect-based hosts don't load reliably (lesson from
// iteration 6's jamData). Every ID below returns 200 from images.unsplash.com.
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`

const you = CONTRIBUTORS[0]
const kelley = CONTRIBUTORS[1]
const josephine = CONTRIBUTORS[2]
const winnie = CONTRIBUTORS[3]

export const TRIP_PLACES: TripPlace[] = [
  {
    id: 'tacoma-narrows',
    name: 'Tacoma Narrows Bridge Viewpoint',
    category: 'Viewpoint',
    detail: 'Narrows Park lookout · suspension bridge',
    rating: 4.7,
    reviewCount: 612,
    markedBy: kelley,
    photo: img('1476231682828-37e571bc172f'), // aerial road through forest
    lngLat: [-122.5514, 47.2707],
    driveTime: '38 min',
    arriveTime: 'Arrive 2:38 PM',
    tripMeta: '35 mi · 2:38 PM',
    bannerRoad: 'WA-16 W',
  },
  {
    id: 'hoodsport-general-store',
    name: 'Hoodsport General Store',
    category: 'Cafe',
    detail: 'Coffee & snacks stop · Hood Canal',
    rating: 4.4,
    reviewCount: 178,
    markedBy: josephine,
    photo: img('1501339847302-ac426a4a7cbb'), // CAFE sign
    lngLat: [-123.1462, 47.4048],
    driveTime: '1 hr 18 min',
    arriveTime: 'Arrive 3:18 PM',
    tripMeta: '73 mi · 3:18 PM',
    bannerRoad: 'US-101 N',
  },
  {
    id: 'hama-hama-oyster-saloon',
    name: 'Hama Hama Oyster Saloon',
    category: 'Restaurants',
    detail: 'Roadside oyster bar · Lilliwaup',
    rating: 4.8,
    reviewCount: 1342,
    markedBy: winnie,
    photo: img('1615141982883-c7ad0e69fd62'), // fresh seafood on ice
    lngLat: [-123.0917, 47.5211],
    driveTime: '1 hr 28 min',
    arriveTime: 'Arrive 3:28 PM',
    tripMeta: '80 mi · 3:28 PM',
    bannerRoad: 'US-101 N',
  },
  {
    id: 'sequim-bay-state-park',
    name: 'Sequim Bay State Park',
    category: 'Rest',
    detail: 'Stretch stop · bayside picnic tables',
    rating: 4.6,
    reviewCount: 388,
    markedBy: kelley,
    photo: img('1444492417251-9c84a5fa18e0'), // bench by the lake
    lngLat: [-123.0034, 48.0721],
    driveTime: '2 hr 15 min',
    arriveTime: 'Arrive 4:15 PM',
    tripMeta: '118 mi · 4:15 PM',
    bannerRoad: 'US-101 N',
  },
  {
    id: 'dungeness-spit',
    name: 'Dungeness Spit Nature Preserve',
    category: 'Nature',
    detail: 'Wildlife refuge · longest sand spit in the US',
    rating: 4.8,
    reviewCount: 892,
    markedBy: you,
    photo: img('1476673160081-cf065607f449'), // beach waves
    lngLat: [-123.1901, 48.1443],
    driveTime: '2 hr 22 min',
    arriveTime: 'Arrive 4:22 PM',
    tripMeta: '123 mi · 4:22 PM',
    bannerRoad: 'US-101 N',
  },
  {
    id: 'downriggers-waterfront',
    name: 'Downriggers on the Waterfront',
    category: 'Restaurants',
    detail: 'Seafood grill · Port Angeles harbor view',
    rating: 4.5,
    reviewCount: 1876,
    markedBy: josephine,
    photo: img('1414235077428-338989a2e8c0'), // fine dining table
    lngLat: [-123.4307, 48.1181],
    driveTime: '2 hr 34 min',
    arriveTime: 'Arrive 4:34 PM',
    tripMeta: '130 mi · 4:34 PM',
    bannerRoad: 'US-101 W',
  },
  {
    id: 'hurricane-ridge',
    name: 'Hurricane Ridge Visitor Center',
    category: 'Viewpoint',
    detail: 'Alpine overlook · Olympic Mountains',
    rating: 4.9,
    reviewCount: 3204,
    markedBy: you,
    photo: img('1506905925346-21bda4d32df4'), // clouds over mountain peaks
    lngLat: [-123.4993, 47.9686],
    driveTime: '3 hr 6 min',
    arriveTime: 'Arrive 5:06 PM',
    tripMeta: '147 mi · 5:06 PM',
    bannerRoad: 'Hurricane Ridge Rd',
  },
  {
    id: 'lake-crescent-lodge',
    name: 'Lake Crescent Lodge',
    category: 'Nature',
    detail: 'Glacial lake · historic lakeside lodge',
    rating: 4.8,
    reviewCount: 1543,
    markedBy: winnie,
    photo: img('1470770903676-69b98201ea1c'), // lake with boats and dock
    lngLat: [-123.7623, 48.0632],
    driveTime: '2 hr 58 min',
    arriveTime: 'Arrive 4:58 PM',
    tripMeta: '145 mi · 4:58 PM',
    bannerRoad: 'US-101 W',
  },
  {
    id: 'sol-duc-falls',
    name: 'Sol Duc Falls',
    category: 'Nature',
    detail: 'Old-growth trail · triple waterfall',
    rating: 4.9,
    reviewCount: 2287,
    markedBy: kelley,
    photo: img('1441974231531-c6227db76b6e'), // sunlit forest trail
    lngLat: [-123.8661, 47.9575],
    driveTime: '3 hr 15 min',
    arriveTime: 'Arrive 5:15 PM',
    tripMeta: '152 mi · 5:15 PM',
    bannerRoad: 'Sol Duc Rd',
  },
  {
    id: 'ruby-beach',
    name: 'Ruby Beach',
    category: 'Nature',
    detail: 'Sea stacks · driftwood-strewn coastline',
    rating: 4.9,
    reviewCount: 3891,
    markedBy: josephine,
    photo: img('1544198365-f5d60b6d8190'), // dramatic rocky peaks
    lngLat: [-124.4118, 47.7122],
    driveTime: '3 hr 52 min',
    arriveTime: 'Arrive 5:52 PM',
    tripMeta: '178 mi · 5:52 PM',
    bannerRoad: 'US-101 S',
  },
]

/** Small crop of a place's photo for its overview map marker (iteration 11). */
export const placeMarkerPhoto = (place: TripPlace) =>
  place.photo.replace('w=500', 'w=160').replace('q=70', 'q=60')

// Live contributions — the fam keeps dropping spots into the shared list while
// the trip is underway. Tapping "Add places" pulls the next one off this pool
// and pops it onto the top of the itinerary (marked by whoever added it), so
// the list visibly grows rather than reading as a static, finished plan.
export const CONTRIBUTABLE_PLACES: TripPlace[] = [
  {
    id: 'marymere-falls',
    name: 'Marymere Falls',
    category: 'Nature',
    detail: 'Old-growth trail · 90-ft waterfall',
    rating: 4.8,
    reviewCount: 1021,
    markedBy: winnie,
    photo: img('1518173946687-a4c8892bbd9f'), // misty forest greenery
    lngLat: [-123.7854, 48.0429],
    driveTime: '3 hr',
    arriveTime: 'Arrive 5:00 PM',
    tripMeta: '148 mi · 5:00 PM',
    bannerRoad: 'US-101 W',
  },
  {
    id: 'kalaloch-lodge',
    name: 'Kalaloch Lodge',
    category: 'Restaurants',
    detail: 'Oceanfront dining · driftwood beach',
    rating: 4.6,
    reviewCount: 967,
    markedBy: josephine,
    photo: img('1552566626-52f8b828add9'), // restaurant interior
    lngLat: [-124.3733, 47.6122],
    driveTime: '3 hr 48 min',
    arriveTime: 'Arrive 5:48 PM',
    tripMeta: '175 mi · 5:48 PM',
    bannerRoad: 'US-101 S',
  },
  {
    id: 'salt-creek-recreation',
    name: 'Salt Creek Recreation Area',
    category: 'Viewpoint',
    detail: 'Tide pools · Strait of Juan de Fuca overlook',
    rating: 4.8,
    reviewCount: 512,
    markedBy: kelley,
    photo: img('1500534623283-312aade485b7'), // sunset over mountains
    lngLat: [-123.6971, 48.1554],
    driveTime: '2 hr 45 min',
    arriveTime: 'Arrive 4:45 PM',
    tripMeta: '138 mi · 4:45 PM',
    bannerRoad: 'Camp Hayden Rd',
  },
  {
    id: 'grannys-cafe',
    name: "Granny's Cafe",
    category: 'Cafe',
    detail: 'Roadside diner · Hwy 101 institution',
    rating: 4.5,
    reviewCount: 645,
    markedBy: winnie,
    photo: img('1442512595331-e89e73853f31'), // pour-over coffee
    lngLat: [-124.2504, 47.9613],
    driveTime: '3 hr 20 min',
    arriveTime: 'Arrive 5:20 PM',
    tripMeta: '158 mi · 5:20 PM',
    bannerRoad: 'US-101 N',
  },
]

// ── "You / Your lists" surface (iteration 13) ────────────────────────────────
// The road trip lives as a saved shared list under the "You" tab. The Olympic
// National Park row is the emphasized hero that opens the collaborative
// itinerary; the rest
// are inert decoys matching the real Google Maps "Your lists" screenshot.
export interface YouList {
  id: string
  emoji: string
  name: string
  meta: string
  /** Shared lists show a mini contributor stack. */
  avatars?: string[]
  /** The one row that opens the road-trip itinerary. */
  roadtrip?: boolean
}

export const YOU_LISTS: YouList[] = [
  {
    id: 'olympic-national-park',
    emoji: '🏔️',
    name: 'Olympic National Park',
    meta: 'Shared · 10 places',
    avatars: [YOU_AVATAR, KELLEY_AVATAR, JOSEPHINE_AVATAR, WINNIE_AVATAR],
    roadtrip: true,
  },
  {
    id: 'seattle-restaurants',
    emoji: '🍔',
    name: 'Seattle Restaurants',
    meta: 'Shared list · 42 places',
    avatars: [KELLEY_AVATAR, WINNIE_AVATAR],
  },
  {
    id: 'saved-trips',
    emoji: '🚗',
    name: 'Saved trips',
    meta: 'Private · 1 trip',
  },
  {
    id: 'we-are-a-joke',
    emoji: '🤡',
    name: 'We are a joke',
    meta: 'Private list · 2 places',
  },
]

// Instruction banner (design.md §6.13)
export const BANNER_TOWARD = 'toward'
export const THEN_LABEL = 'Then'
