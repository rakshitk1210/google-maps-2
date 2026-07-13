// Shared road-trip roster portraits — used by iterations 4–7 so faces stay
// consistent wherever people appear (search bar, jam members, car pin, friends).

import josephine from '../../People on Roadtrip/Josephine.png'
import kelley from '../../People on Roadtrip/Kelley.png'
import rakshit from '../../People on Roadtrip/Rakshit.png'
import winnie from '../../People on Roadtrip/Winnie.png'

/** Phone user / "you" — search-bar avatar across iterations. */
export const YOU_AVATAR = rakshit

/** Driver — Kelley (iteration 5 historically called this role "Kyle"). */
export const KELLEY_AVATAR = kelley

export const JOSEPHINE_AVATAR = josephine
export const WINNIE_AVATAR = winnie

/** Full jam / road-trip roster: you, Kelley, Josephine, Winnie. */
export const MEMBER_AVATARS = [YOU_AVATAR, KELLEY_AVATAR, JOSEPHINE_AVATAR, WINNIE_AVATAR] as const
