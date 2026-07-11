import { Icon } from '../../components/Icon'
import { formatDistanceMiles, formatDuration, type MapsList } from './lists'

interface DriveSheetProps {
  list: MapsList
  routeInfo: { durationSec: number; distanceMeters: number } | null
  onClose: () => void
}

export function DriveSheet({ list, routeInfo, onClose }: DriveSheetProps) {
  const lastPlace = list.places[list.places.length - 1]
  const middleStopCount = Math.max(list.places.length - 1, 0)

  return (
    <>
      <div className="drive-overlay-card">
        <div className="drive-overlay-row">
          <span className="drive-overlay-dot" />
          <span className="drive-overlay-label">Your location</span>
        </div>
        <div className="drive-overlay-connector" />
        <div className="drive-overlay-row">
          <span className="drive-overlay-stop-icon">
            <Icon name="fiber_manual_record" size={10} />
          </span>
          <span className="drive-overlay-label">
            {middleStopCount} stop{middleStopCount === 1 ? '' : 's'}
          </span>
        </div>
        <div className="drive-overlay-connector" />
        <div className="drive-overlay-row">
          <Icon name="location_on" size={18} className="search-pill-icon" />
          <span className="drive-overlay-label">{lastPlace.name}</span>
        </div>
        <button className="drive-overlay-more">
          <Icon name="more_horiz" size={18} />
        </button>
      </div>

      <div className="drive-sheet">
        <div className="you-sheet-handle" />

        <div className="drive-header">
          <h2>Drive</h2>
          <button className="you-bell" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="drive-mode-tabs">
          <div className="drive-mode-tab drive-mode-tab-active">
            <Icon name="directions_car" size={22} fill />
            <span>{routeInfo ? formatDuration(routeInfo.durationSec) : '—'}</span>
          </div>
          <div className="drive-mode-tab">
            <Icon name="directions_transit" size={22} />
            <span>—</span>
          </div>
          <div className="drive-mode-tab">
            <Icon name="directions_walk" size={22} />
            <span>—</span>
          </div>
          <div className="drive-mode-tab">
            <Icon name="directions_bike" size={22} />
            <span>—</span>
          </div>
        </div>

        <div className="drive-duration">{routeInfo ? formatDuration(routeInfo.durationSec) : '—'}</div>
        <div className="drive-distance">
          {routeInfo ? formatDistanceMiles(routeInfo.distanceMeters) : '—'} · Fastest route, the usual traffic
        </div>

        <div className="drive-badges">
          <div className="drive-badge">
            <Icon name="toll" size={16} />
            No tolls
          </div>
          <div className="drive-badge">
            <Icon name="eco" size={16} />
            Fuel-efficient
          </div>
        </div>

        <div className="drive-actions">
          <button className="list-detail-pill list-detail-pill-primary">Start</button>
          <button className="list-detail-pill">Add stops</button>
          <button className="list-detail-pill">Save</button>
        </div>
      </div>
    </>
  )
}
