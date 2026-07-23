// Iteration 14 — Kelley's Roadtrip on CarPlay. Mid-drive, the road-trip button
// (the travelers' faces) splits the head unit into map + itinerary panel so
// every marked place stays one tap away — no search mode needed. Selecting a
// place previews directions; "Go" starts the leg. Coordinates are real
// Washington spots along US-101 from the U District toward Olympic National
// Park.

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
// of the shared Olympic National Park itinerary follows so the panel reads as
// the complete trip.
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
    lngLat: [-122.626, 47.5673],
    arrival: '4:35',
    durationMin: '48',
    distanceMi: '26',
    bannerDistance: '0.4 mi',
    bannerToward: 'WA-304 W',
  },
  {
    id: 'bar-bar-bar',
    name: 'Bar Bar Bar',
    rating: 4.9,
    reviewCount: 214,
    markedBy: winnie,
    lngLat: [-123.1007, 47.2151],
    arrival: '5:05',
    durationMin: '65',
    distanceMi: '62',
    bannerDistance: '0.3 mi',
    bannerToward: 'S 1st St',
  },
  {
    id: 'tacoma-narrows',
    name: 'Tacoma Narrows Bridge Viewpoint',
    rating: 4.7,
    reviewCount: 612,
    markedBy: kelley,
    lngLat: [-122.5514, 47.2707],
    arrival: '4:12',
    durationMin: '38',
    distanceMi: '35',
    bannerDistance: '0.5 mi',
    bannerToward: 'WA-16 W',
  },
  {
    id: 'hoodsport-general-store',
    name: 'Hoodsport General Store',
    rating: 4.4,
    reviewCount: 178,
    markedBy: josephine,
    lngLat: [-123.1462, 47.4048],
    arrival: '4:52',
    durationMin: '78',
    distanceMi: '73',
    bannerDistance: '0.5 mi',
    bannerToward: 'US-101 N',
  },
  {
    id: 'hama-hama-oyster-saloon',
    name: 'Hama Hama Oyster Saloon',
    rating: 4.8,
    reviewCount: 1342,
    markedBy: winnie,
    lngLat: [-123.0917, 47.5211],
    arrival: '5:02',
    durationMin: '88',
    distanceMi: '80',
    bannerDistance: '0.4 mi',
    bannerToward: 'US-101 N',
  },
  {
    id: 'sequim-bay-state-park',
    name: 'Sequim Bay State Park',
    rating: 4.6,
    reviewCount: 388,
    markedBy: kelley,
    lngLat: [-123.0034, 48.0721],
    arrival: '5:49',
    durationMin: '135',
    distanceMi: '118',
    bannerDistance: '0.6 mi',
    bannerToward: 'US-101 N',
  },
  {
    id: 'dungeness-spit',
    name: 'Dungeness Spit Nature Preserve',
    rating: 4.8,
    reviewCount: 892,
    markedBy: you,
    lngLat: [-123.1901, 48.1443],
    arrival: '5:56',
    durationMin: '142',
    distanceMi: '123',
    bannerDistance: '0.2 mi',
    bannerToward: 'Kitchen-Dick Rd',
  },
  {
    id: 'downriggers-waterfront',
    name: 'Downriggers on the Waterfront',
    rating: 4.5,
    reviewCount: 1876,
    markedBy: josephine,
    lngLat: [-123.4307, 48.1181],
    arrival: '6:08',
    durationMin: '154',
    distanceMi: '130',
    bannerDistance: '0.7 mi',
    bannerToward: 'US-101 W',
  },
  {
    id: 'hurricane-ridge',
    name: 'Hurricane Ridge Visitor Center',
    rating: 4.9,
    reviewCount: 3204,
    markedBy: you,
    lngLat: [-123.4993, 47.9686],
    arrival: '6:40',
    durationMin: '186',
    distanceMi: '147',
    bannerDistance: '1.2 mi',
    bannerToward: 'Hurricane Ridge Rd',
  },
  {
    id: 'lake-crescent-lodge',
    name: 'Lake Crescent Lodge',
    rating: 4.8,
    reviewCount: 1543,
    markedBy: winnie,
    lngLat: [-123.7623, 48.0632],
    arrival: '6:32',
    durationMin: '178',
    distanceMi: '145',
    bannerDistance: '0.9 mi',
    bannerToward: 'US-101 W',
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
// Hurricane Ridge is far enough that the intro drive never runs out.
export const CAR_START: [number, number] = [-122.3168, 47.6553]
export const DRIVE_DEST: [number, number] = [-123.4993, 47.9686]
