import { GoogleMapsClone as GoogleMapsCloneV1 } from '../iterations/iteration1/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV2 } from '../iterations/iteration2/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV3 } from '../iterations/iteration3/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV4 } from '../iterations/iteration4/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV5 } from '../iterations/iteration5/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV6 } from '../iterations/iteration6/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV7 } from '../iterations/iteration7/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV8 } from '../iterations/iteration8/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV9 } from '../iterations/iteration9/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV10 } from '../iterations/iteration10/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV11 } from '../iterations/iteration11/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV12 } from '../iterations/iteration12/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV13 } from '../iterations/iteration13/GoogleMapsClone'

interface PhoneFrameProps {
  iterationId: number
}

export function PhoneFrame({ iterationId }: PhoneFrameProps) {
  // Iteration 6 is a dual-device stage (CarPlay + phone) and renders its own
  // frames instead of the shared portrait phone chrome.
  if (iterationId === 6) return <GoogleMapsCloneV6 />

  // Iteration 12 is a solo CarPlay head-unit stage — same early return.
  if (iterationId === 12) return <GoogleMapsCloneV12 />

  return (
    <div className="phone-frame">
      {iterationId === 1 && <GoogleMapsCloneV1 />}
      {iterationId === 2 && <GoogleMapsCloneV2 />}
      {iterationId === 3 && <GoogleMapsCloneV3 />}
      {iterationId === 4 && <GoogleMapsCloneV4 />}
      {iterationId === 5 && <GoogleMapsCloneV5 />}
      {iterationId === 7 && <GoogleMapsCloneV7 />}
      {iterationId === 8 && <GoogleMapsCloneV8 />}
      {iterationId === 9 && <GoogleMapsCloneV9 />}
      {iterationId === 10 && <GoogleMapsCloneV10 />}
      {iterationId === 11 && <GoogleMapsCloneV11 />}
      {iterationId === 13 && <GoogleMapsCloneV13 />}
    </div>
  )
}
