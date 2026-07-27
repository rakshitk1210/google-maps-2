# Scott Feedback — Road trip app design
**Meeting:** Jul 23 · Spatial map features & storytelling  
**Participants:** Kelley Yu (+ team), Scott  
**Purpose:** Shared thinking doc — what landed, what’s missing, and what to push next.

---

## Verdict in one line
Functionally solid and the storyboards finally feel like a journey — but push **spatial map thinking**, **younger visual language**, and the **full trip arc** (including reminiscing) harder.

---

## What’s working

1. **Storyboards feel like a story**  
   Scott feels like he’s along for the journey with the team. Real storyboards landed well — keep that narrative spine.

2. **Shared itinerary concept makes sense**  
   Functionally clear: group planning, shared list, roles in the car. Bones are right.

3. **Smarter offline maps is a strong problem**  
   Road-trip-aware offline download (because the jam/route is known) is better than today’s radius / buried manual download. Worth keeping; sharpen how you *tell* that story.

4. **Exploration variant stood out**  
   The later vertical “blocks of cards” / Drawing Board–adjacent exploration felt more exploratory than the safe Maps-looking work. Direction: go farther there.

5. **Permission to leave the safe Maps look**  
   Explicit green light to paint outside the edges. Core thesis is young people doing this *together* — aesthetic can evolve beyond classic Maps without abandoning good bones.

---

## Core challenges (priority order)

### 1. Design *on the map*, not only in sheets
**Challenge Scott gives every designer:** *What if you couldn’t put it in a sheet — what would you put on the map?*

- Don’t shy away from active nav / driving map moments.
- Shared itinerary items shouldn’t live only as a list on the right — help people **spatially** know where cool stuff is.
- Zoomed-out route overview: pins the group marked + **stacked “heads”** so the map feels social.
  - “All four of us thought that was cool, but only two of us saved that one.”
  - Cluster of interest → “we could hit all four with a small detour.”

**Think-together prompts**
- [ ] Which moment of the trip is most map-first (parked overview? mid-drive decision? lunch ahead?)?
- [ ] What UI currently in a sheet could become a map affordance instead?
- [ ] How do group votes / interest show without cluttering nav?

### 2. Spatial decision-making for the group
Road trips are full of “straight boring way vs. scenic alt route.” Make that decision **visible on the map**.

Examples Scott liked:
- Two routes to next stop; scenic one has 3 saved places → no-brainer.
- Upcoming place already on the itinerary (e.g. brewery) visible ahead → “should we stop? oh right, we added that yesterday.”
- Post pit-stop, still parked, ignition on: overview of next leg — lunch, detours, what’s coming — **the map helps the group decide**.

**Think-together prompts**
- [ ] What’s the hero spatial moment we want in the deck/prototype?
- [ ] How do passenger suggestions surface for driver / CarPlay without breaking flow?
- [ ] Parked vs. driving: different map modes?

### 3. Complete the story arc — including reminiscing
Missing beat: **months later**, hanging out, sharing the trip back.

Not every screen — one strong moment:
- Friends at a coffee shop / taco place three months later
- Phone shows a memory (photo, place, “remember when…”)
- Closes the loop: pre → during → after (connection outlasts the drive)

**Think-together prompts**
- [ ] What’s the single reminiscing screen that proves the full arc?
- [ ] What artifact travels from trip → later (shared album, map memory, jam recap)?

### 4. Push the visual language
Current work reads **utilitarian / safe Google Maps**. Fine bones, but underplays the thesis (young, together, fresh take on an old product).

- Push visuals further (especially where you already stepped into exploration).
- Still: bones > skin — build things people care about first; aesthetics amplify, don’t replace.

**Think-together prompts**
- [ ] Where do we keep Maps DNA vs. where do we intentionally break it?
- [ ] Which exploration frame becomes the new visual north star?

### 5. Sharpen the “how they connect” story
If someone only sees the mechanism (everyone connected into Maps / the jam), they should get it without the verbal pitch.

- How did they end up here? Are they literally in the car together?
- Make the **connection mechanism** legible in the visuals/storyboards.

**Think-together prompts**
- [ ] What’s the one frame that answers “how are they all in this together?”
- [ ] Passenger research → shared list → CarPlay / driver access: is that chain clear?

---

## Offline maps — facts + design implications

| Today (Scott) | Opportunity (your concept) |
|---|---|
| Auto-downloads a big radius around you; often invisible by design | Because jam/route is known, download the **route + along-route** intelligently |
| Manual offline areas exist but are buried | Trip-aware offline feels proactive and explainable |
| Offline routing is less sophisticated; improves when back online | Story: Maps already cached the trip path — show with a small diagram if needed |
| Live View / camera AR: needs connection today for full experience | Cached pins on offline map → theoretically pan camera and see those pins offline (not current product, but plausible) — **not** full cloud AR offline |

**Storytelling tip:** You may not visualize “download happening” — a corner diagram (“Maps already offline’d this route because of the jam”) can sell the idea.

**Feasibility note:** Full AR Live View offline is uncertain; local camera + cached pins/routing is the more credible stretch.

---

## Process advice from Scott
1. **Wireframe the whole arc fast** — stub edges so you know the full shape, then fill in.
2. **Converge** — too many ideas; need edges and priority.
3. Low-fi storyboards + wireframes can later up-res (even to rough video) once the spine is clear.

---

## Suggested next moves (for us)

| Priority | Move | Why |
|---|---|---|
| P0 | One map-first spatial concept (overview + social pins / route choice) | Direct answer to Scott’s recurring challenge |
| P0 | Stub full journey wireframes including reminiscing | Completes the arc he called missing |
| P1 | Sharpen “how the group connects” beat | Makes thesis legible without narration |
| P1 | Push one exploration visual direction harder | Permission + clear preference for less-safe look |
| P2 | Offline story diagram / sharper narrative | Idea is good; storytelling can be sharper |

---

## Open questions for the team

1. What’s the **single spatial map moment** we’d show Scott next that couldn’t live in a sheet?
2. Do we converge on **parked group decision** or **in-nav upcoming stop** as the map hero?
3. What’s our **visual north star** — which exploration frame do we double down on?
4. What does **reminiscing** look like as one screen — memory object, shared map, or conversation?
5. How explicit should **offline** be in the story vs. magical/invisible (Scott’s old offline work preferred invisible when it “just works”)?

---

## Tone of the feedback
Encouraging and constructive. “Great work / looking good” — ask is to go farther on map spatiality, youth aesthetic, and end-to-end storytelling, not to rebuild the concept.
