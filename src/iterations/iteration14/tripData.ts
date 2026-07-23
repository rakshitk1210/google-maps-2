// Iteration 14 — Kelley's Roadtrip on CarPlay. Mid-drive, the road-trip button
// (the travelers' faces) splits the head unit into map + itinerary panel so
// every marked place stays one tap away — no search mode needed. Selecting a
// place previews directions; "Go" starts the leg. Coordinates are real
// Washington spots fanning up I-5 from the U District toward Skagit Valley.

import {
  JOSEPHINE_AVATAR,
  KELLEY_AVATAR,
  WINNIE_AVATAR,
  YOU_AVATAR,
} from '../../shared/peopleAvatars'

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

export const TRIP_TITLE = "Kelley's Roadtrip"

export interface TripPlace {
  id: string
  name: string
  rating: number
  reviewCount: number
  markedBy: Contributor
  lngLat: [number, number]
  /** Directions-card / post-Go ETA pill stats: arrival · minutes · miles. */
  arrival: string
  durationMin: string
  distanceMi: string
  /** Post-Go instruction banner: distance to the next maneuver + road. */
  bannerDistance: string
  bannerToward: string
}

const you = CONTRIBUTORS[0]
const kelley = CONTRIBUTORS[1]
const josephine = CONTRIBUTORS[2]
const winnie = CONTRIBUTORS[3]

// The three Figma rows lead (Cafe Ladro is the freshly marked stop); the rest
// of the shared itinerary follows so the panel reads as the complete trip.
export const TRIP_PLACES: TripPlace[] = [
  {
    id: 'cafe-ladro',
    name: 'Cafe Ladro',
    rating: 4.9,
    reviewCount: 214,
    markedBy: josephine,
    lngLat: [-122.3128, 47.6231],
    arrival: '3:48',
    durationMin: '22',
    distanceMi: '3.9',
    bannerDistance: '0.2 mi',
    bannerToward: 'E Roy St',
  },
  {
    id: 'hotel-aruba',
    name: 'Hotel Aruba',
    rating: 4.9,
    reviewCount: 214,
    markedBy: kelley,
    lngLat: [-122.2183, 47.979],
    arrival: '4:35',
    durationMin: '48',
    distanceMi: '26',
    bannerDistance: '0.4 mi',
    bannerToward: 'W Marine View Dr',
  },
  {
    id: 'bar-bar-bar',
    name: 'Bar Bar Bar',
    rating: 4.9,
    reviewCount: 214,
    markedBy: winnie,
    lngLat: [-122.3346, 48.4212],
    arrival: '5:05',
    durationMin: '65',
    distanceMi: '62',
    bannerDistance: '0.3 mi',
    bannerToward: 'S 1st St',
  },
  {
    id: 'ivars-mukilteo',
    name: "Ivar's Mukilteo Landing",
    rating: 4.6,
    reviewCount: 1893,
    markedBy: winnie,
    lngLat: [-122.3046, 47.949],
    arrival: '4:12',
    durationMin: '38',
    distanceMi: '24',
    bannerDistance: '0.5 mi',
    bannerToward: 'Mukilteo Spdwy',
  },
  {
    id: 'smokey-point',
    name: 'Smokey Point Rest Area',
    rating: 4.2,
    reviewCount: 402,
    markedBy: kelley,
    lngLat: [-122.184, 48.152],
    arrival: '4:40',
    durationMin: '52',
    distanceMi: '39',
    bannerDistance: '0.5 mi',
    bannerToward: 'I-5 N',
  },
  {
    id: 'snow-goose',
    name: 'Snow Goose Produce',
    rating: 4.8,
    reviewCount: 1547,
    markedBy: you,
    lngLat: [-122.3459, 48.3733],
    arrival: '4:55',
    durationMin: '64',
    distanceMi: '58',
    bannerDistance: '0.4 mi',
    bannerToward: 'Fir Island Rd',
  },
  {
    id: 'tulip-town',
    name: 'Tulip Town',
    rating: 4.7,
    reviewCount: 986,
    markedBy: josephine,
    lngLat: [-122.3898, 48.4181],
    arrival: '5:02',
    durationMin: '69',
    distanceMi: '62',
    bannerDistance: '0.6 mi',
    bannerToward: 'Bradshaw Rd',
  },
  {
    id: 'calico-cupboard',
    name: 'Calico Cupboard Cafe',
    rating: 4.7,
    reviewCount: 1211,
    markedBy: winnie,
    lngLat: [-122.4977, 48.3898],
    arrival: '5:08',
    durationMin: '72',
    distanceMi: '64',
    bannerDistance: '0.2 mi',
    bannerToward: 'First St',
  },
  {
    id: 'padilla-bay',
    name: 'Padilla Bay Shore Trail',
    rating: 4.8,
    reviewCount: 334,
    markedBy: kelley,
    lngLat: [-122.4667, 48.4964],
    arrival: '5:11',
    durationMin: '75',
    distanceMi: '67',
    bannerDistance: '0.7 mi',
    bannerToward: 'Bayview-Edison Rd',
  },
  {
    id: 'deception-pass',
    name: 'Deception Pass Bridge',
    rating: 4.9,
    reviewCount: 4102,
    markedBy: you,
    lngLat: [-122.6446, 48.4064],
    arrival: '5:22',
    durationMin: '86',
    distanceMi: '78',
    bannerDistance: '1.2 mi',
    bannerToward: 'WA-20 W',
  },
  {
    id: 'chuckanut',
    name: 'Chuckanut Drive Overlook',
    rating: 4.8,
    reviewCount: 517,
    markedBy: josephine,
    lngLat: [-122.491, 48.6531],
    arrival: '5:17',
    durationMin: '81',
    distanceMi: '74',
    bannerDistance: '0.9 mi',
    bannerToward: 'Chuckanut Dr',
  },
]

// Nav constants — match the Figma frames.
export const CARPLAY_CLOCK = '21:13'
export const COMPASS_LABEL = 'SW'
export const BANNER_DISTANCE = '200 m'
export const BANNER_TOWARD = '11th Ave NE'

// Bottom ETA pill (floating, per the reference): arrival · min · mi.
export const ETA_ARRIVAL = '3:48'
export const ETA_DURATION = '12'
export const ETA_DISTANCE = '3.9'

// Intro drive: 11th Ave NE is the northbound one-way of the U District
// couplet, so the Directions route genuinely drives north up it (frame 1).
// Mount Vernon is far enough that the intro drive never runs out.
export const CAR_START: [number, number] = [-122.3168, 47.6553]
export const DRIVE_DEST: [number, number] = [-122.3346, 48.4212]
