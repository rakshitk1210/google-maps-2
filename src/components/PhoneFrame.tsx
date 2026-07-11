import { GoogleMapsClone as GoogleMapsCloneV1 } from '../iterations/iteration1/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV2 } from '../iterations/iteration2/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV3 } from '../iterations/iteration3/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV4 } from '../iterations/iteration4/GoogleMapsClone'
import { GoogleMapsClone as GoogleMapsCloneV5 } from '../iterations/iteration5/GoogleMapsClone'

interface PhoneFrameProps {
  iterationId: number
}

export function PhoneFrame({ iterationId }: PhoneFrameProps) {
  return (
    <div className="phone-frame">
      {iterationId === 1 && <GoogleMapsCloneV1 />}
      {iterationId === 2 && <GoogleMapsCloneV2 />}
      {iterationId === 3 && <GoogleMapsCloneV3 />}
      {iterationId === 4 && <GoogleMapsCloneV4 />}
      {iterationId === 5 && <GoogleMapsCloneV5 />}
    </div>
  )
}
