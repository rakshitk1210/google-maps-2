import { Icon } from '../../components/Icon'

export function FloatingControls() {
  return (
    <>
      <button className="fab fab-layers">
        <Icon name="layers" size={22} />
      </button>
      <button className="fab fab-locate">
        <Icon name="my_location" size={22} />
      </button>
      <button className="fab fab-directions">
        <Icon name="directions" size={26} fill />
      </button>
    </>
  )
}
