// Iteration 12 — Gemini offline-maps voice prompt on CarPlay.
// The whole Gemini exchange is audio-only (no on-screen text); these strings
// are what Gemini actually speaks via the Web Speech API. Nav constants match
// the real CarPlay reference screenshot.

// Nav scene: driving north on I-5 out of Seattle toward Vancouver, BC.
export const CARPLAY_CLOCK = '3:36'
export const COMPASS_LABEL = 'N'
export const BANNER_DISTANCE = '0.5 mi'
export const BANNER_INSTRUCTION = 'E Hamlin St'

// Bottom ETA pill (floating, per the reference): arrival · duration · distance.
export const ETA_ARRIVAL = '3:48'
export const ETA_DURATION = '12 min'
export const ETA_DISTANCE = '3.9 mi'

// Speed cluster (top-right, per the reference): posted limit + live speed.
export const SPEED_LIMIT = '60'
export const CURRENT_SPEED = '62'

// I-5 drive: start on the freeway in Seattle, destination Vancouver, BC. The
// directions route follows I-5 north, which is what the camera animates along.
export const CAR_START: [number, number] = [-122.3255, 47.647]
export const VANCOUVER: [number, number] = [-123.1207, 49.2827]

// What Gemini says out loud. Voice is real (speechSynthesis); the reply is
// captured by speech recognition when a mic is available, and falls back to
// the presenter keys (Y / N) with an auto-yes timeout otherwise.
export const GEMINI_PROMPT =
  "Heads up — you're approaching a stretch on I-5 with low network coverage. Want me to download an offline map for the rest of the drive?"
export const GEMINI_DOWNLOADED_LINE = "Done. Your offline map is saved — you're covered for the drive."
export const GEMINI_DECLINED_LINE = "No problem. I'll skip the download."

// Flow choreography (ms). The 2s of plain navigation lets the drive get going
// before Gemini speaks up.
export const NAV_INTRO_MS = 2000
export const APPEAR_MS = 500
// Safety ceiling only — advances to listening if TTS never fires its end event
// (audio fully blocked). Set generously so real ElevenLabs playback of the full
// prompt (~8-9s) finishes and drives the transition itself.
export const SPEAKING_MAX_MS = 14000
export const LISTENING_TIMEOUT_MS = 5000
export const PROCESSING_MS = 1800
export const WIPE_MS = 1200
export const DOWNLOADED_MS = 3600
export const DECLINED_MS = 2600
