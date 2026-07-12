import { GoogleMapsClone as GoogleMapsCloneV1 } from '../iterations/iteration1/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV2 } from '../iterations/iteration2/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV3 } from '../iterations/iteration3/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV4 } from '../iterations/iteration4/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV5 } from '../iterations/iteration5/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV6 } from '../iterations/iteration6/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV7 } from '../iterations/iteration7/GoogleMapsClone'

interface PhoneFrameProps {
  iterationId: number
}

export function PhoneFrame({ iterationId }: PhoneFrameProps) {
  // Iteration 6 is a dual-device stage (CarPlay + phone) and renders its own
  // frames instead of the shared portrait phone chrome.
  if (iterationId === 6) return <GoogleMapsCloneV6 />

  return (
    <div className="phone-frame">
      {iterationId === 1 && <GoogleMapsCloneV1 />}
      {iterationId === 2 && <GoogleMapsCloneV2 />}
      {iterationId === 3 && <GoogleMapsCloneV3 />}
      {iterationId === 4 && <GoogleMapsCloneV4 />}
      {iterationId === 5 && <GoogleMapsCloneV5 />}
      {iterationId === 7 && <GoogleMapsCloneV7 />}
    </div>
  )
}
