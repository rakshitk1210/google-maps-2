// Content inside Road Trip mode: the trip fam, the places they marked, the
// captured/locked moments, and gems left on the map by friends who aren't on
// this trip. Cafe data mirrors iteration 6's jamData (same Unsplash CDN
// helper) — iterations stay self-contained.

export interface TripFriend {
  name: string
  avatar: string
  detail: string
}

// Index 0 of the randomuser set is "you" (search-bar avatar) — the fam uses
// the rest of the roster plus one extra portrait.
export const TRIP_FRIENDS: TripFriend[] = [
  {
    name: 'Josephine',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    detail: 'Riding shotgun · 4 places marked',
  },
  {
    name: 'Winnie',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    detail: 'Snack captain · 2 places marked',
  },
  {
    name: 'Kelley',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    detail: 'Driving · made the playlist',
  },
]

export interface FamPlace {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  markedBy: string
  note: string
  photos: string[]
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`

export const FAM_PLACES: FamPlace[] = [
  {
    id: 'cafe-ladro',
    name: 'Cafe Ladro',
    category: 'Cafe',
    rating: 4.9,
    reviewCount: 214,
    markedBy: 'Marked by Josephine',
    note: '“Honey-lavender latte + resident cafe cat. Non-negotiable stop.”',
    photos: [
      img('1495474472287-4d71bcdd2085'), // latte art overhead
      img('1509440159596-0249088772ff'), // espresso close-up
      img('1445116572660-236099ec97a0'), // cafe interior warm light
    ],
  },
  {
    id: 'analog',
    name: 'Analog Coffee',
    category: 'Coffee shop',
    rating: 4.7,
    reviewCount: 180,
    markedBy: 'Marked by Winnie',
    note: '“Crates of vinyl and dialed-in pour-overs. Worth the detour.”',
    photos: [
      img('1442512595331-e89e73853f31'), // vinyl records + coffee
      img('1461023058943-07fcbe16d735'), // pour-over drip
      img('1481833761820-0509d3217039'), // cozy cafe interior
    ],
  },
]

export interface Moment {
  id: string
  photo: string
  caption: string
}

// Unsplash CDN only — the redirect-based picsum.photos images used by early
// iterations don't load reliably (same lesson as iteration 6's jamData).
// These IDs are all already proven in iterations 4 and 6.
const moment = (id: string, unsplashId: string, caption: string): Moment => ({
  id,
  photo: img(unsplashId),
  caption,
})

export const CAPTURED_MOMENTS: Moment[] = [
  moment('overlook', '1531091881557-e0b21c6c56b9', 'Golden hour overlook'),
  moment('brunch', '1504754524776-8f4f37790ca0', 'Roadside brunch'),
  moment('records', '1442512595331-e89e73853f31', 'Record shop find'),
  moment('latte', '1495474472287-4d71bcdd2085', 'Latte cheers'),
]

export const LOCKED_MOMENTS: Moment[] = [
  moment('locked-1', '1509440159596-0249088772ff', ''),
  moment('locked-2', '1533089860892-a7c6f0a88666', ''),
  moment('locked-3', '1481833761820-0509d3217039', ''),
]

export interface FriendGems {
  friend: string
  moments: Moment[]
}

// Gems the fam captured for others to find later — badge these tiles.
export const FRIEND_GEM_MOMENTS: FriendGems[] = [
  {
    friend: 'Josephine',
    moments: [
      moment('jo-1', '1445116572660-236099ec97a0', ''),
      moment('jo-2', '1509042239860-f550ce710b93', ''),
      moment('jo-3', '1461023058943-07fcbe16d735', ''),
    ],
  },
  {
    friend: 'Winnie',
    moments: [
      moment('win-1', '1514066558159-fc8c737ef259', ''),
      moment('win-2', '1497935586351-b67a49e012bf', ''),
      moment('win-3', '1559305616-3f99cd43e353', ''),
    ],
  },
]

export interface RemoteGem {
  name: string
  lngLat: [number, number]
}

// Gems left by friends who are NOT on this road trip — 40 of them scattered
// across Washington. Only the handful near the start (U District) show at the
// default zoom; the rest reward panning and zooming out across the state.
export const REMOTE_GEMS: RemoteGem[] = [
  // Seattle metro & Puget Sound
  { name: 'Peggy', lngLat: [-122.3835, 47.6685] }, // Ballard
  { name: 'Chandana', lngLat: [-122.3193, 47.621] }, // Capitol Hill
  { name: 'Alex', lngLat: [-122.413, 47.576] }, // Alki, West Seattle
  { name: 'Stella', lngLat: [-122.2855, 47.559] }, // Columbia City
  { name: 'Marcus', lngLat: [-122.335, 47.608] }, // Downtown Seattle
  { name: 'Priya', lngLat: [-122.35, 47.651] }, // Fremont
  { name: 'Dashiell', lngLat: [-122.201, 47.61] }, // Bellevue
  { name: 'Noor', lngLat: [-122.1215, 47.674] }, // Redmond
  { name: 'Tobias', lngLat: [-122.209, 47.6769] }, // Kirkland
  { name: 'Freya', lngLat: [-122.202, 47.979] }, // Everett
  { name: 'Ezra', lngLat: [-122.4443, 47.2529] }, // Tacoma
  { name: 'Lucia', lngLat: [-122.9007, 47.0379] }, // Olympia
  { name: 'Kenji', lngLat: [-122.627, 47.5673] }, // Bremerton
  { name: 'Imani', lngLat: [-122.5199, 47.6262] }, // Bainbridge Island
  { name: 'Rowan', lngLat: [-122.3773, 47.8107] }, // Edmonds
  { name: 'Sasha', lngLat: [-122.2054, 47.7623] }, // Bothell
  { name: 'Diego', lngLat: [-122.217, 47.4829] }, // Renton
  { name: 'Yara', lngLat: [-122.2287, 47.3073] }, // Auburn
  { name: 'Callum', lngLat: [-122.2929, 47.1854] }, // Puyallup
  { name: 'Mei', lngLat: [-122.5799, 47.3293] }, // Gig Harbor
  // Olympic Peninsula & coast
  { name: 'Bodhi', lngLat: [-123.4307, 48.1181] }, // Port Angeles
  { name: 'Ingrid', lngLat: [-122.7604, 48.117] }, // Port Townsend
  { name: 'Rafael', lngLat: [-123.1021, 48.0795] }, // Sequim
  { name: 'Thandie', lngLat: [-123.8157, 46.9754] }, // Aberdeen
  { name: 'Silas', lngLat: [-124.3861, 47.9503] }, // Forks
  { name: 'Anya', lngLat: [-124.1563, 47.014] }, // Ocean Shores
  // San Juans & north
  { name: 'Malik', lngLat: [-122.4787, 48.7519] }, // Bellingham
  { name: 'Juniper', lngLat: [-122.6127, 48.5126] }, // Anacortes
  { name: 'Oscar', lngLat: [-123.017, 48.5343] }, // Friday Harbor
  { name: 'Leila', lngLat: [-122.3341, 48.4201] }, // Mount Vernon
  // Cascades
  { name: 'Finn', lngLat: [-120.6615, 47.5962] }, // Leavenworth
  { name: 'Zara', lngLat: [-120.1876, 48.476] }, // Winthrop
  { name: 'Hugo', lngLat: [-120.0166, 47.841] }, // Lake Chelan
  { name: 'Nadia', lngLat: [-120.3103, 47.4235] }, // Wenatchee
  { name: 'Emmett', lngLat: [-121.8244, 46.8523] }, // Mount Rainier
  // Eastern Washington
  { name: 'Saanvi', lngLat: [-117.426, 47.6588] }, // Spokane
  { name: 'Beckett', lngLat: [-118.343, 46.0646] }, // Walla Walla
  { name: 'Camille', lngLat: [-120.5059, 46.6021] }, // Yakima
  { name: 'Idris', lngLat: [-120.5478, 46.9965] }, // Ellensburg
  { name: 'Willa', lngLat: [-119.2752, 46.2857] }, // Richland
]
