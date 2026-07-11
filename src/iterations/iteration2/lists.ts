export interface ListPlace {
  name: string
  category: string
  rating?: string
  reviews?: string
  lngLat: [number, number]
}

export interface MapsList {
  id: string
  icon: string
  name: string
  description: string
  type: 'private' | 'shared'
  places: ListPlace[]
  collaborators: string[]
}

export const INITIAL_LISTS: MapsList[] = [
  {
    id: 'we-are-a-joke',
    icon: '🤡',
    name: 'We are a joke',
    description: '',
    type: 'private',
    places: [
      { name: 'Langley', category: 'Locality', lngLat: [-122.4013, 48.0387] },
      {
        name: 'Ledgewood Beach County Park',
        category: 'Park',
        rating: '4.6',
        reviews: '70',
        lngLat: [-122.6957, 48.1206],
      },
    ],
    collaborators: [],
  },
  {
    id: 'screenshots',
    icon: '📸',
    name: 'Screenshots',
    description: '',
    type: 'private',
    places: [],
    collaborators: [],
  },
]

export const SUGGESTED_PLACES: ListPlace[] = [
  { name: 'Langley', category: 'Recently viewed', lngLat: [-122.4013, 48.0387] },
  { name: 'Whidbey Island', rating: '4.8', reviews: '930', category: 'Island', lngLat: [-122.5566, 48.2088] },
  {
    name: 'Ledgewood Beach County Park',
    rating: '4.6',
    reviews: '70',
    category: 'Park',
    lngLat: [-122.6957, 48.1206],
  },
  { name: 'Gasworks Brewing', rating: '4.5', reviews: '412', category: 'Brewery', lngLat: [-122.3493, 47.6467] },
]

export const SEATTLE_PLACES: ListPlace[] = [
  { name: 'Pike Place Market', category: 'Market', rating: '4.7', reviews: '68,000', lngLat: [-122.3421, 47.6097] },
  {
    name: 'Space Needle',
    category: 'Observation deck',
    rating: '4.6',
    reviews: '52,000',
    lngLat: [-122.3493, 47.6205],
  },
  {
    name: 'Chihuly Garden and Glass',
    category: 'Art museum',
    rating: '4.7',
    reviews: '19,000',
    lngLat: [-122.3506, 47.6203],
  },
  { name: 'Kerry Park', category: 'Park', rating: '4.8', reviews: '6,200', lngLat: [-122.3607, 47.6295] },
  { name: 'Gas Works Park', category: 'Park', rating: '4.7', reviews: '9,800', lngLat: [-122.3346, 47.6456] },
  { name: 'Discovery Park', category: 'Park', rating: '4.8', reviews: '3,400', lngLat: [-122.4247, 47.6613] },
  {
    name: 'Pioneer Square',
    category: 'Historic district',
    rating: '4.5',
    reviews: '4,100',
    lngLat: [-122.3336, 47.6015],
  },
  { name: 'Fremont Troll', category: 'Sculpture', rating: '4.6', reviews: '11,000', lngLat: [-122.3487, 47.6512] },
  { name: 'Volunteer Park', category: 'Park', rating: '4.7', reviews: '5,600', lngLat: [-122.3151, 47.6298] },
  { name: 'Alki Beach', category: 'Beach', rating: '4.7', reviews: '4,900', lngLat: [-122.4088, 47.5799] },
]

export function formatNames(names: string[]): string {
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}

export function formatDistanceMiles(meters: number): string {
  return `${(meters / 1609.344).toFixed(1)} mi`
}
