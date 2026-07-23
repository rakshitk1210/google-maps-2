// Iteration 9 — the shared "Roadtrip to Skagit Valley" itinerary. The fam
// curates places along the drive north; each one is tagged with who marked it
// so the list reads as a group effort. Coordinates are real Washington spots
// fanning up I-5 from the U District toward Skagit Valley.

import {
  JOSEPHINE_AVATAR,
  KELLEY_AVATAR,
  WINNIE_AVATAR,
  YOU_AVATAR,
} from '../../shared/peopleAvatars'

export { YOU_AVATAR, KELLEY_AVATAR, JOSEPHINE_AVATAR, WINNIE_AVATAR }

export const TRIP_TITLE = 'Skagit Valley'

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
    id: 'ancient-douglas-fir',
    name: 'Ancient Douglas-fir tree',
    category: 'Nature',
    detail: 'Scenic spot · old-growth giant',
    rating: 4.8,
    reviewCount: 42,
    markedBy: kelley,
    photo: img('1506744038136-46273834b3fb'), // sun through the forest canopy
    lngLat: [-122.3612, 48.3016],
    driveTime: '58 min',
    arriveTime: 'Arrive 5:58 PM',
    tripMeta: '53 mi · 5:58 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'cafe-ladro',
    name: 'Cafe Ladro',
    category: 'Cafe',
    detail: 'Espresso bar · Edmonds waterfront',
    rating: 4.9,
    reviewCount: 214,
    markedBy: josephine,
    photo: img('1495474472287-4d71bcdd2085'), // latte art overhead
    lngLat: [-122.3774, 47.8107],
    driveTime: '47 min',
    arriveTime: 'Arrive 5:55 PM',
    tripMeta: '18 mi · 5:55 PM',
    bannerRoad: 'NE 45th St',
  },
  {
    id: 'ivars-mukilteo',
    name: "Ivar's Mukilteo Landing",
    category: 'Restaurants',
    detail: 'Fish bar on the ferry dock',
    rating: 4.6,
    reviewCount: 1893,
    markedBy: winnie,
    photo: img('1504754524776-8f4f37790ca0'), // brunch plate overhead
    lngLat: [-122.3046, 47.949],
    driveTime: '38 min',
    arriveTime: 'Arrive 5:46 PM',
    tripMeta: '24 mi · 5:46 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'smokey-point',
    name: 'Smokey Point Rest Area',
    category: 'Rest',
    detail: 'Stretch stop · free coffee cart',
    rating: 4.2,
    reviewCount: 402,
    markedBy: kelley,
    photo: img('1519003722824-194d4455a60c'), // highway truck
    lngLat: [-122.184, 48.152],
    driveTime: '52 min',
    arriveTime: 'Arrive 6:00 PM',
    tripMeta: '39 mi · 6:00 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'snow-goose',
    name: 'Snow Goose Produce',
    category: 'Restaurants',
    detail: 'Farm stand · "immodest" ice cream cones',
    rating: 4.8,
    reviewCount: 1547,
    markedBy: you,
    photo: img('1509042239860-f550ce710b93'), // pastries spread
    lngLat: [-122.3459, 48.3733],
    driveTime: '1 hr 4 min',
    arriveTime: 'Arrive 6:12 PM',
    tripMeta: '58 mi · 6:12 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'tulip-town',
    name: 'Tulip Town',
    category: 'Nature',
    detail: 'Tulip fields · Skagit Valley',
    rating: 4.7,
    reviewCount: 986,
    markedBy: josephine,
    photo: img('1472214103451-9374bd1c798e'), // golden field at sunset
    lngLat: [-122.3898, 48.4181],
    driveTime: '1 hr 9 min',
    arriveTime: 'Arrive 6:17 PM',
    tripMeta: '62 mi · 6:17 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'calico-cupboard',
    name: 'Calico Cupboard Cafe',
    category: 'Cafe',
    detail: 'Bakery cafe · La Conner waterfront',
    rating: 4.7,
    reviewCount: 1211,
    markedBy: winnie,
    photo: img('1514066558159-fc8c737ef259'), // croissant and coffee
    lngLat: [-122.4977, 48.3898],
    driveTime: '1 hr 12 min',
    arriveTime: 'Arrive 6:20 PM',
    tripMeta: '64 mi · 6:20 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'padilla-bay',
    name: 'Padilla Bay Shore Trail',
    category: 'Nature',
    detail: 'Flat bayside walk · heron country',
    rating: 4.8,
    reviewCount: 334,
    markedBy: kelley,
    photo: img('1506744038136-46273834b3fb'), // river through forest
    lngLat: [-122.4667, 48.4964],
    driveTime: '1 hr 15 min',
    arriveTime: 'Arrive 6:23 PM',
    tripMeta: '67 mi · 6:23 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'deception-pass',
    name: 'Deception Pass Bridge',
    category: 'Nature',
    detail: 'Canyon bridge · swirling green water',
    rating: 4.9,
    reviewCount: 4102,
    markedBy: you,
    photo: img('1501785888041-af3ef285b470'), // mountain lake sunset
    lngLat: [-122.6446, 48.4064],
    driveTime: '1 hr 26 min',
    arriveTime: 'Arrive 6:34 PM',
    tripMeta: '78 mi · 6:34 PM',
    bannerRoad: 'WA-20 W',
  },
  {
    id: 'chuckanut',
    name: 'Chuckanut Drive Overlook',
    category: 'Viewpoint',
    detail: 'Cliffside pullout over Samish Bay',
    rating: 4.8,
    reviewCount: 517,
    markedBy: josephine,
    photo: img('1531091881557-e0b21c6c56b9'), // golden hour overlook
    lngLat: [-122.491, 48.6531],
    driveTime: '1 hr 21 min',
    arriveTime: 'Arrive 6:29 PM',
    tripMeta: '74 mi · 6:29 PM',
    bannerRoad: 'Chuckanut Dr',
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
    id: 'rockport-forest',
    name: 'Rockport State Park',
    category: 'Nature',
    detail: 'Old-growth trail · 300-ft firs',
    rating: 4.8,
    reviewCount: 261,
    markedBy: winnie,
    photo: img('1441974231531-c6227db76b6e'), // sunlit forest
    lngLat: [-122.281, 48.4487],
    driveTime: '1 hr 2 min',
    arriveTime: 'Arrive 6:06 PM',
    tripMeta: '55 mi · 6:06 PM',
    bannerRoad: 'WA-20 E',
  },
  {
    id: 'bow-hill-berries',
    name: 'Bow Hill Blueberries',
    category: 'Restaurants',
    detail: 'U-pick farm · blueberry ice cream',
    rating: 4.9,
    reviewCount: 188,
    markedBy: josephine,
    photo: img('1498837167922-ddd27525d352'), // farm produce spread
    lngLat: [-122.3979, 48.5556],
    driveTime: '1 hr 10 min',
    arriveTime: 'Arrive 6:18 PM',
    tripMeta: '61 mi · 6:18 PM',
    bannerRoad: 'I-5 N',
  },
  {
    id: 'larrabee-viewpoint',
    name: 'Larrabee State Park',
    category: 'Viewpoint',
    detail: 'Samish Bay overlook · sunset rocks',
    rating: 4.8,
    reviewCount: 743,
    markedBy: kelley,
    photo: img('1470240731273-7821a6eeb6bd'), // coastal viewpoint
    lngLat: [-122.4894, 48.6512],
    driveTime: '1 hr 24 min',
    arriveTime: 'Arrive 6:32 PM',
    tripMeta: '76 mi · 6:32 PM',
    bannerRoad: 'Chuckanut Dr',
  },
  {
    id: 'samish-cheese',
    name: 'Samish Bay Cheese',
    category: 'Cafe',
    detail: 'Creamery shop · farm tasting board',
    rating: 4.7,
    reviewCount: 96,
    markedBy: winnie,
    photo: img('1452195100486-9cc805987862'), // rustic cafe board
    lngLat: [-122.3835, 48.5794],
    driveTime: '1 hr 12 min',
    arriveTime: 'Arrive 6:20 PM',
    tripMeta: '63 mi · 6:20 PM',
    bannerRoad: 'I-5 N',
  },
]

// ── "You / Your lists" surface (iteration 13) ────────────────────────────────
// The road trip lives as a saved shared list under the "You" tab. The Skagit
// row is the emphasized hero that opens the collaborative itinerary; the rest
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
    id: 'skagit-valley',
    emoji: '😍',
    name: 'Skagit Valley',
    meta: 'Shared · 10 places',
    avatars: [YOU_AVATAR, KELLEY_AVATAR, JOSEPHINE_AVATAR, WINNIE_AVATAR],
    roadtrip: true,
  },
  {
    id: 'seattle-darshan',
    emoji: '🚩',
    name: 'Seattle darshan',
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
