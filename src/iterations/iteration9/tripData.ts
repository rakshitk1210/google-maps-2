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

export { YOU_AVATAR }

export const TRIP_TITLE = 'Roadtrip to Skagit Valley'

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

export type PlaceCategory = 'Food' | 'Cafe' | 'Nature' | 'Rest' | 'Viewpoint'

export const CATEGORIES: Array<'All' | PlaceCategory> = [
  'All',
  'Food',
  'Cafe',
  'Nature',
  'Rest',
  'Viewpoint',
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
    category: 'Food',
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
    category: 'Food',
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

// Instruction banner (design.md §6.13)
export const BANNER_TOWARD = 'toward'
export const THEN_LABEL = 'Then'
