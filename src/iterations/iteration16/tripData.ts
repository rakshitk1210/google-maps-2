// Iteration 16 — the "North Cascades trip" that arrives by way of a shared
// YouTube video. SHARED_PLACES is what the share drops onto the map (trails,
// viewpoints and cafes the group already curated); the restaurants only surface
// once the user filters for them, and any one of them can be saved into the trip.
//
// Coordinates sit along the WA-20 corridor through the Ross Lake National
// Recreation Area, laid out so the twelve pins read as a planned route without
// their labels colliding at the default zoom.

import {
  JOSEPHINE_AVATAR,
  KELLEY_AVATAR,
  WINNIE_AVATAR,
  YOU_AVATAR,
} from '../../shared/peopleAvatars'

import trail1 from './assets/trail-1.png'
import trail2 from './assets/trail-2.png'
import trail3 from './assets/trail-3.png'
import trail4 from './assets/trail-4.png'
import gridCrystalLake from './assets/grid-crystal-lake.png'
import gridSunsetRidge from './assets/grid-sunset-ridge.png'
import gridMapleGrove from './assets/grid-maple-grove.png'
import gridPineValley from './assets/grid-pine-valley.png'
import foodBurgersLake from './assets/food-burgers-lake.png'
import foodLakesideBurger from './assets/food-lakeside-burger.png'
import foodFreshBites from './assets/food-fresh-bites.png'
import foodHealthySub from './assets/food-healthy-sub.png'
import foodSeasideFish from './assets/food-seaside-fish.png'
import foodChippysFish from './assets/food-chippys-fish.png'
import cafeLatte from './assets/cafe-latte.jpg'
import cafeBakery from './assets/cafe-bakery.jpg'
import cafeColdBrew from './assets/cafe-coldbrew.jpg'

export const TRIP_TITLE = 'North Cascades trip'
export const TRIP_MILES = '234 mi'

/** Map framing when the share first opens — the WA-20 / Diablo Lake corridor. */
export const MAP_CENTER: [number, number] = [-121.03, 48.72]
export const MAP_ZOOM = 8.9

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

const [you, kelley, josephine, winnie] = CONTRIBUTORS

/** List-page filter chips, per the Figma trip page. */
export const CATEGORIES = ['All', 'Nature', 'Cafe', 'Food', 'View points'] as const
export type Category = (typeof CATEGORIES)[number]

export interface TripPlace {
  id: string
  name: string
  /** 'shared' pins arrive with the share; 'restaurant' pins only under the filter. */
  kind: 'shared' | 'restaurant'
  /** Which list-page chip this place answers to. */
  category: Exclude<Category, 'All'>
  /** Sheet subtitle, e.g. "Hiking trail · Ross Lake". */
  detail: string
  rating: number
  reviewCount: number
  priceRange: string
  openNote: string
  driveNote: string
  markedBy: Contributor
  /** 32px circular map-pin photo. */
  pinPhoto: string
  /** Larger crop for the detail sheet hero and the list-page grid card. */
  photo: string
  description: string
  highlights: string[]
  lngLat: [number, number]
}

export const SHARED_PLACES: TripPlace[] = [
  {
    id: 'emerald-ridge-trek',
    name: 'Emerald Ridge Trek',
    kind: 'shared',
    category: 'Nature',
    detail: 'Ridge hike · Ross Lake overlook',
    rating: 4.8,
    reviewCount: 1204,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '2 hr 40 min from Seattle · 118 mi',
    markedBy: kelley,
    pinPhoto: trail1,
    photo: gridSunsetRidge,
    description:
      'A steady climb through subalpine meadow to a ridgeline that looks straight down the length of Ross Lake. Best in late afternoon when the water turns green.',
    highlights: [
      'Northwest Forest Pass required at the trailhead',
      'Last mile is exposed — bring a windbreaker',
      'Snow lingers on the ridge into early July',
    ],
    lngLat: [-120.9735, 48.8919],
  },
  {
    id: 'silver-falls-path',
    name: 'Silver Falls Path',
    kind: 'shared',
    category: 'Nature',
    detail: 'Waterfall loop · old-growth cedar',
    rating: 4.7,
    reviewCount: 863,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '2 hr 25 min from Seattle · 108 mi',
    markedBy: josephine,
    pinPhoto: trail3,
    photo: gridPineValley,
    description:
      'Short, mossy loop that ends at a two-tier falls tucked behind old-growth cedar. Shaded the whole way, so it holds up on a hot afternoon.',
    highlights: [
      'Boardwalk section can be slick after rain',
      'Stroller-friendly for the first half mile',
      'No cell service past the parking area',
    ],
    lngLat: [-121.1564, 48.8322],
  },
  {
    id: 'whispering-pines-walk',
    name: 'Whispering Pines Walk',
    kind: 'shared',
    category: 'Nature',
    detail: 'Forest walk · interpretive signs',
    rating: 4.5,
    reviewCount: 421,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '2 hr 50 min from Seattle · 124 mi',
    markedBy: winnie,
    pinPhoto: trail2,
    photo: gridMapleGrove,
    description:
      'Flat, quiet interpretive loop through second-growth pine. The kind of stop that works when everyone needs to stretch but nobody wants to climb.',
    highlights: [
      'Vault toilet at the trailhead',
      'Interpretive signs cover the 1968 burn',
      'Popular with families on weekends',
    ],
    lngLat: [-120.9173, 48.7602],
  },
  {
    id: 'diablo-lake-walk',
    name: 'Diablo lake walk',
    kind: 'shared',
    category: 'View points',
    detail: 'Lakeshore stroll · turquoise water',
    rating: 4.9,
    reviewCount: 3187,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '2 hr 15 min from Seattle · 102 mi',
    markedBy: you,
    pinPhoto: trail4,
    photo: gridCrystalLake,
    description:
      'The one everybody stops for. Glacial flour turns Diablo Lake an unreal turquoise, and the shoreline path gets you to the water without the overlook crowd.',
    highlights: [
      'Overlook lot fills by 10 AM in summer',
      'Color is strongest under midday sun',
      'Boat tours leave from the north shore',
    ],
    lngLat: [-121.1564, 48.7159],
  },
  {
    id: 'mountain-view-expedition',
    name: 'Mountain View Expedition',
    kind: 'shared',
    category: 'View points',
    detail: 'Full-day hike · Cascade summits',
    rating: 4.8,
    reviewCount: 967,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '2 hr 5 min from Seattle · 96 mi',
    markedBy: kelley,
    pinPhoto: trail1,
    photo: gridSunsetRidge,
    description:
      'A committing all-day push with switchbacks that pay off in a 360° look at the Picket Range. Start early — the last water source is at mile three.',
    highlights: [
      'Allow 7–8 hours round trip',
      'Carry 3L of water per person',
      'Ridge is exposed to afternoon lightning',
    ],
    lngLat: [-121.0248, 48.6141],
  },
  {
    id: 'crystal-lake-trail',
    name: 'Crystal Lake Trail',
    kind: 'shared',
    category: 'Nature',
    detail: 'Alpine lake · wildflower basin',
    rating: 4.7,
    reviewCount: 1521,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '1 hr 55 min from Seattle · 88 mi',
    markedBy: winnie,
    pinPhoto: trail4,
    photo: gridCrystalLake,
    description:
      'Climbs into a wildflower basin holding a lake cold enough to hurt. Peak bloom lands mid-July and the meadow smells like the whole trip was worth it.',
    highlights: [
      'Swim access on the far side of the outlet',
      'Mosquitoes are heavy through July',
      'Camping requires a backcountry permit',
    ],
    lngLat: [-120.9221, 48.5194],
  },
  {
    id: 'north-ross-viewpoint',
    name: 'North Ross Viewpoint',
    kind: 'shared',
    category: 'View points',
    detail: 'Pullout · north end of Ross Lake',
    rating: 4.6,
    reviewCount: 542,
    priceRange: 'Free',
    openNote: 'Open · 24 hours',
    driveNote: '3 hr 5 min from Seattle · 131 mi',
    markedBy: josephine,
    pinPhoto: trail2,
    photo: gridSunsetRidge,
    description:
      'A gravel pullout most people drive straight past. Walk fifty feet to the rail and the lake opens up all the way to the Canadian border.',
    highlights: [
      'Room for about four cars',
      'Best light in the first hour after sunrise',
      'Watch for logging trucks pulling out',
    ],
    lngLat: [-121.0922, 48.9526],
  },
  {
    id: 'sunrise-ridge-lookout',
    name: 'Sunrise Ridge Lookout',
    kind: 'shared',
    category: 'View points',
    detail: 'Fire lookout · panoramic ridge',
    rating: 4.9,
    reviewCount: 1876,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '2 hr 55 min from Seattle · 126 mi',
    markedBy: you,
    pinPhoto: trail1,
    photo: gridMapleGrove,
    description:
      'A restored fire lookout perched where three valleys meet. The climb is short but relentless, and the payoff is the best single view on the trip.',
    highlights: [
      'Final approach is a steep scramble',
      'Lookout interior is open to visitors',
      'Gets busy at sunset on weekends',
    ],
    lngLat: [-120.8868, 48.8374],
  },
  {
    id: 'cedar-hollow-loop',
    name: 'Cedar Hollow Loop',
    kind: 'shared',
    category: 'Nature',
    detail: 'Easy loop · mossy cedar grove',
    rating: 4.5,
    reviewCount: 634,
    priceRange: 'Free',
    openNote: 'Open · Sunrise–sunset',
    driveNote: '2 hr 10 min from Seattle · 99 mi',
    markedBy: winnie,
    pinPhoto: trail3,
    photo: gridPineValley,
    description:
      'Twenty quiet minutes through cedars big enough that the trail goes around them. A good leg-stretch when nobody has the energy for a real hike.',
    highlights: [
      'Flat gravel the whole way',
      'Shaded even at midday',
      'Restrooms at the trailhead',
    ],
    lngLat: [-121.1917, 48.6563],
  },
  {
    id: 'basecamp-coffee-house',
    name: 'Basecamp Coffee House',
    kind: 'shared',
    category: 'Cafe',
    detail: 'Coffee house · pastries & maps',
    rating: 4.8,
    reviewCount: 1204,
    priceRange: '$$',
    openNote: 'Open · Closes 5 PM',
    driveNote: '2 hr from Seattle · 92 mi',
    markedBy: kelley,
    pinPhoto: cafeLatte,
    photo: cafeLatte,
    description:
      'The last proper espresso before the pass, run by people who actually hike. Ask about trail conditions and you will get a real answer.',
    highlights: [
      'Opens at 6 AM for early starts',
      'Free trail-condition board by the door',
      'Cash tips only',
    ],
    lngLat: [-120.8948, 48.6666],
  },
  {
    id: 'trailhead-espresso-bar',
    name: 'Trailhead Espresso Bar',
    kind: 'shared',
    category: 'Cafe',
    detail: 'Espresso window · cold brew on tap',
    rating: 4.6,
    reviewCount: 487,
    priceRange: '$',
    openNote: 'Open · Closes 4 PM',
    driveNote: '2 hr 30 min from Seattle · 110 mi',
    markedBy: josephine,
    pinPhoto: cafeColdBrew,
    photo: cafeColdBrew,
    description:
      'A walk-up window in a converted horse trailer. Cold brew on tap, two stools, and a dog bowl by the step.',
    highlights: [
      'Cold brew is the move here',
      'Closes early if the weather turns',
      'Card and tap only',
    ],
    lngLat: [-121.1917, 48.5616],
  },
  {
    id: 'glacier-bean-roasters',
    name: 'Glacier Bean Roasters',
    kind: 'shared',
    category: 'Cafe',
    detail: 'Roastery & bakery · morning stop',
    rating: 4.7,
    reviewCount: 913,
    priceRange: '$$',
    openNote: 'Open · Closes 3 PM',
    driveNote: '1 hr 50 min from Seattle · 84 mi',
    markedBy: winnie,
    pinPhoto: cafeBakery,
    photo: cafeBakery,
    description:
      'They roast in the back and bake in the front, so the whole place smells like the reason you got up early. Loaves sell out by ten.',
    highlights: [
      'Bread is gone by 10 AM',
      'Beans sold whole or ground to order',
      'Small lot, easy street parking',
    ],
    lngLat: [-121.1372, 48.4669],
  },
]

// Only surfaced by the Restaurants filter. Anything the user saves gets folded
// into the trip alongside the trail places.
export const RESTAURANT_PLACES: TripPlace[] = [
  {
    id: 'seaside-fish-chips',
    name: 'Seaside Fish & Chips',
    kind: 'restaurant',
    category: 'Food',
    detail: 'Fish & chips · counter service',
    rating: 4.6,
    reviewCount: 812,
    priceRange: '$$',
    openNote: 'Open · Closes 9 PM',
    driveNote: '6 min detour off WA-20',
    markedBy: josephine,
    pinPhoto: foodSeasideFish,
    photo: foodSeasideFish,
    description:
      'Beer-battered cod and hand-cut fries out of a walk-up window, eaten at picnic tables under the cedars. Cash goes faster than the card reader.',
    highlights: [
      'Cash line moves twice as fast',
      'Halibut sells out by 7 PM',
      'Picnic tables only — no indoor seating',
    ],
    lngLat: [-121.0938, 48.8538],
  },
  {
    id: 'fresh-bites-deli',
    name: 'Fresh Bites Deli',
    kind: 'restaurant',
    category: 'Food',
    detail: 'Deli · trail lunches to go',
    rating: 4.7,
    reviewCount: 534,
    priceRange: '$',
    openNote: 'Open · Closes 6 PM',
    driveNote: '3 min detour off WA-20',
    markedBy: kelley,
    pinPhoto: foodFreshBites,
    photo: foodFreshBites,
    description:
      'Sandwiches built for a daypack, plus the last real coffee before the pass. They will wrap anything to travel if you say you are heading up.',
    highlights: [
      'Order the trail box for groups of four',
      'Espresso bar closes an hour before the deli',
      'Fills up with hikers 7–9 AM',
    ],
    lngLat: [-120.9975, 48.8086],
  },
  {
    id: 'burgers-by-the-lake',
    name: 'Burgers by the Lake',
    kind: 'restaurant',
    category: 'Food',
    detail: 'Burgers · lakeside patio',
    rating: 4.5,
    reviewCount: 1743,
    priceRange: '$$',
    openNote: 'Open · Closes 10 PM',
    driveNote: '2 min detour off WA-20',
    markedBy: you,
    pinPhoto: foodBurgersLake,
    photo: foodBurgersLake,
    description:
      'Griddled smash burgers and a patio that looks straight at the water. The obvious dinner stop after a day on the Diablo shoreline.',
    highlights: [
      'Patio tables are first come, first served',
      'Milkshakes are a full meal on their own',
      'Kitchen closes 30 min before the bar',
    ],
    lngLat: [-121.0393, 48.7139],
  },
  {
    id: 'chippys-fish-shack',
    name: "Chippy's Fish Shack",
    kind: 'restaurant',
    category: 'Food',
    detail: 'Seafood shack · roadside',
    rating: 4.4,
    reviewCount: 396,
    priceRange: '$$',
    openNote: 'Open · Closes 8 PM',
    driveNote: '1 min detour off WA-20',
    markedBy: winnie,
    pinPhoto: foodChippysFish,
    photo: foodChippysFish,
    description:
      'A shack with six stools and a fryer that never rests. Order the basket, sit on the tailgate, do not overthink it.',
    highlights: [
      'Six stools total — plan to take it to go',
      'Chowder is only on weekends',
      'Closed Tuesdays outside of summer',
    ],
    lngLat: [-121.1853, 48.6645],
  },
  {
    id: 'lakeside-burger-joint',
    name: 'Lakeside Burger Joint',
    kind: 'restaurant',
    category: 'Food',
    detail: 'Burgers · late night',
    rating: 4.3,
    reviewCount: 628,
    priceRange: '$$',
    openNote: 'Open · Closes 11 PM',
    driveNote: '8 min detour off WA-20',
    markedBy: josephine,
    pinPhoto: foodLakesideBurger,
    photo: foodLakesideBurger,
    description:
      'The only kitchen still open once the sun drops behind the ridge. Nothing fancy, but it is warm and it is there.',
    highlights: [
      'Last order 30 min before close',
      'Only late-night option east of Newhalem',
      'Card only — no cash',
    ],
    lngLat: [-120.8322, 48.6635],
  },
  {
    id: 'healthy-sub-station',
    name: 'Healthy Sub Station',
    kind: 'restaurant',
    category: 'Food',
    detail: 'Subs & salads · quick stop',
    rating: 4.2,
    reviewCount: 287,
    priceRange: '$',
    openNote: 'Open · Closes 7 PM',
    driveNote: '5 min detour off WA-20',
    markedBy: kelley,
    pinPhoto: foodHealthySub,
    photo: foodHealthySub,
    description:
      'Build-your-own subs and grain bowls for when the group has had three fried meals in a row and somebody says something about it.',
    highlights: [
      'Gluten-free bread available',
      'Bowls travel better than the subs',
      'Small lot — trailers will not fit',
    ],
    lngLat: [-120.8483, 48.5503],
  },
]

export const ALL_PLACES = [...SHARED_PLACES, ...RESTAURANT_PLACES]

export const findPlace = (id: string | null) =>
  id ? (ALL_PLACES.find((p) => p.id === id) ?? null) : null

/**
 * The pins on the map right now: the shared trip always, plus restaurants when
 * the filter is on or once they've been saved. The map draws this set and the
 * detail sheet swipes through it, so both have to agree on the order.
 */
export const visiblePlaces = (restaurantsMode: boolean, savedIds: string[]): TripPlace[] => [
  ...SHARED_PLACES,
  ...RESTAURANT_PLACES.filter((p) => restaurantsMode || savedIds.includes(p.id)),
]

// Sample reviews for the detail sheet (same shape as iteration 11's).
export const SAMPLE_REVIEWS = [
  {
    name: 'Marcus Webb',
    avatar: KELLEY_AVATAR,
    rating: 5,
    text: 'Pulled off here on a whim and it ended up being the best stop of the whole drive. Go before noon if you can.',
  },
  {
    name: 'Priya Raghavan',
    avatar: JOSEPHINE_AVATAR,
    rating: 4,
    text: 'Exactly as advertised. Parking was tight by the time we got there, but worth circling for a spot.',
  },
]
