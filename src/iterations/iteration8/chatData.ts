// Iteration 8 — the Google-created traffic group chat. Participants are
// strangers stuck in the same jam (initial-letter avatars, not the road-trip
// roster: these are drivers you've never met). "You" renders with YOU_AVATAR.

export interface Participant {
  id: string
  name: string
  initial: string
  color: string
}

export const PARTICIPANTS: Participant[] = [
  { id: 'alex', name: 'Alex', initial: 'A', color: '#1A73E8' },
  { id: 'priya', name: 'Priya', initial: 'P', color: '#7B1FA2' },
  { id: 'marcus', name: 'Marcus', initial: 'M', color: '#188038' },
  { id: 'dana', name: 'Dana', initial: 'D', color: '#B3261E' },
]

export function participantById(id: string): Participant | undefined {
  return PARTICIPANTS.find((p) => p.id === id)
}

export const CHAT_TITLE = 'Traffic on 11th Ave NE'
export const CHAT_SUBTITLE = '5 drivers · created by Google Maps'
export const CHAT_PLACEHOLDER = 'Message drivers nearby'

export interface ChatMessage {
  id: string
  kind: 'system' | 'text' | 'photo'
  /** Participant id, or 'you' for the phone user. Absent on system lines. */
  authorId?: string
  text: string
  photoUrl?: string
}

// Same Unsplash pattern as iterations 6/7 use for non-avatar photos.
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=70`

/** The view from the front of the line — the broken-down truck. */
export const TRUCK_PHOTO = img('1519003722824-194d4455a60c')

export const SEED_MESSAGES: ChatMessage[] = [
  { id: 's1', kind: 'system', text: 'Google Maps created this chat for drivers stuck on 11th Ave NE' },
  { id: 's2', kind: 'text', authorId: 'priya', text: 'Anyone know why we’re not moving?' },
  { id: 's3', kind: 'text', authorId: 'marcus', text: 'Been sitting here 5 min 😩' },
]

export interface ScriptedReply {
  authorId: string
  text: string
  photoUrl?: string
  /** Pause before the typing indicator appears. */
  typingDelayMs: number
  /** How long the indicator shows before the message lands. */
  typingDurationMs: number
}

export interface ReplyRule {
  keywords: string[]
  replies: ScriptedReply[]
}

// First rule whose keyword appears in the user's message wins; each rule
// fires once, then re-asking falls through to the rotating fallbacks.
export const REPLY_RULES: ReplyRule[] = [
  {
    keywords: ['holding', 'hold up', 'held', 'what happened', 'why', 'stuck', 'going on', 'blocked', 'jam'],
    replies: [
      {
        authorId: 'alex',
        text: 'There’s a garbage truck broken down right at the light — I’m near the front',
        typingDelayMs: 900,
        typingDurationMs: 1400,
      },
      {
        authorId: 'alex',
        text: 'Here’s the view from up here 📸',
        photoUrl: TRUCK_PHOTO,
        typingDelayMs: 800,
        typingDurationMs: 1200,
      },
    ],
  },
  {
    keywords: ['how much', 'time', 'long', 'status', 'eta', 'when', 'minutes'],
    replies: [
      {
        authorId: 'priya',
        text: 'Tow truck just pulled up — probably 15 more mins',
        typingDelayMs: 1000,
        typingDurationMs: 1500,
      },
    ],
  },
  {
    keywords: ['thanks', 'thank', 'appreciate'],
    replies: [
      {
        authorId: 'marcus',
        text: 'np, good luck out there 🚗',
        typingDelayMs: 700,
        typingDurationMs: 1000,
      },
    ],
  },
]

/** Generic plausible replies for anything the rules don't cover. */
export const FALLBACK_REPLIES: ScriptedReply[] = [
  {
    authorId: 'dana',
    text: 'Yeah, whole block is backed up — haven’t moved an inch',
    typingDelayMs: 1000,
    typingDurationMs: 1400,
  },
  {
    authorId: 'marcus',
    text: 'Same here. At least we’re all in it together lol',
    typingDelayMs: 900,
    typingDurationMs: 1300,
  },
  {
    authorId: 'priya',
    text: 'Hang tight — sounds like it should clear soon',
    typingDelayMs: 1000,
    typingDurationMs: 1400,
  },
]

/**
 * Ambient chatter fired once after the chat is created (relative to the FAB
 * appearing), so the thread feels alive and badges the FAB while closed.
 */
export const AMBIENT_MESSAGES: { afterMs: number; authorId: string; text: string }[] = [
  { afterMs: 9000, authorId: 'dana', text: 'A cop just showed up to wave people around it' },
  { afterMs: 22000, authorId: 'marcus', text: 'Left lane is starting to crawl 🎉' },
]
