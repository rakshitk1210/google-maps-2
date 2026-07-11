// Scenario: driving I-5 southbound near Fife/Tacoma toward Portland when the
// driver spots a gem Alex left at the Nisqually Wildlife Refuge (I-5 Exit 114).
// All coordinates are [lng, lat] per mapbox convention.

export const CAR_POSITION: [number, number] = [-122.357, 47.253]
export const DESTINATION: [number, number] = [-122.6765, 45.5231]
export const GEM_POSITION: [number, number] = [-122.713, 47.0736]

export const GEM_TITLE = "Alex's gem"
export const GEM_PLACE_NAME = 'Nisqually Wildlife Refuge'
export const GEM_SUBTITLE = `${GEM_PLACE_NAME} · 30 min away`
export const GEM_DESCRIPTION =
  'Alex left this gem here — a quiet boardwalk over the estuary, right off Exit 114. “Worth every minute of the detour.”'
export const GEM_CTA_LABEL = 'Go there'

// Screen 1 — original route to Portland
export const NAV_DISTANCE = '50 ft'
export const NAV_INSTRUCTION = 'Exit 137, WA-99 S'
export const FULL_TRIP_DURATION = '2 hr 20 min'
export const FULL_TRIP_META = '142 mi · 5:40 PM'

// Screen 3 — rerouted to the gem
export const GEM_NAV_DISTANCE = '100 ft'
export const GEM_NAV_INSTRUCTION = 'Exit 114, Nisqually'
export const GEM_TRIP_DURATION = '30 min'
export const GEM_TRIP_META = '24 mi · 3:50 PM'

// Arrival notification
export const NOTIFICATION_APP = 'Google Maps'
export const NOTIFICATION_TIME = 'now'
export const NOTIFICATION_TITLE = 'You found a gem'
export const NOTIFICATION_BODY = "Alex left a gem at Nisqually Wildlife Refuge. Tap to reveal it."

// Scratch-to-reveal memory left by Alex
// Rattlesnake Ledge / Rattlesnake Lake trail near Seattle.
export const MEMORY_IMAGE =
  'https://images.unsplash.com/photo-1531091881557-e0b21c6c56b9?w=640&h=800&fit=crop&q=80'
export const SCRATCH_HINT = 'Scratch to reveal'
export const MEMORY_CAPTION =
  '“Golden hour on the boardwalk. The tide was out and the whole estuary lit up.” — Alex'
export const CAPTURE_CTA_LABEL = 'Capture memory'

// Camera + review
export const CAMERA_TITLE = 'Google Gem'
export const REVIEW_HEADLINE = 'Your memory is captured.'
export const REVIEW_SUBMIT_LABEL = 'Submit'
export const CAPTURE_FALLBACK_IMAGE = 'https://picsum.photos/seed/your-memory/640/800'

// Explore home after the gem is created — two gems now live on this spot.
export const ALEX_GEM_LABEL = 'Alex'
export const KELLEY_GEM_LABEL = 'Kelley'
// Kelley's gem sits just beside Alex's so both read as "on the same spot".
export const KELLEY_GEM_POSITION: [number, number] = [-122.7104, 47.0738]
export const HOME_TOAST_LABEL = 'Gem created'
export const SEARCH_PLACEHOLDER = 'Search here'
export const ASK_MAPS_LABEL = 'Ask Maps'
