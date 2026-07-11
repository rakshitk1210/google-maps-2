import { Icon } from '../../components/Icon'
import { formatDuration, type MapsList } from './lists'

interface RoadtripChatSheetProps {
  list: MapsList
  routeInfo: { durationSec: number; distanceMeters: number } | null
  onViewRoute: () => void
  onClose: () => void
}

export function RoadtripChatSheet({ list, routeInfo, onViewRoute, onClose }: RoadtripChatSheetProps) {
  const firstPlace = list.places[0]
  const lastPlace = list.places[list.places.length - 1]
  const stopCount = list.places.length

  return (
    <div className="roadtrip-chat-sheet">
      <div className="you-sheet-handle" />

      <div className="roadtrip-chat-header">
        <div className="roadtrip-chat-title">
          <Icon name="auto_awesome" size={20} />
          <span>Ask Maps</span>
        </div>
        <div className="roadtrip-chat-actions">
          <button className="you-bell">
            <Icon name="history" size={18} />
          </button>
          <button className="you-bell">
            <Icon name="edit" size={18} />
          </button>
          <button className="you-bell" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
      </div>

      <div className="roadtrip-chat-body">
        <div className="roadtrip-chat-user-bubble">Plan a road trip for {list.name}</div>

        <p className="roadtrip-chat-ai-text">
          {stopCount === 1
            ? `A road trip to ${firstPlace.name} — add more places to map out a full route.`
            : `A road trip through ${list.name} takes you from ${firstPlace.name} to ${lastPlace.name}, covering ${stopCount} stops along the way.`}
        </p>

        {routeInfo && (
          <button className="roadtrip-route-card" onClick={onViewRoute}>
            <span className="roadtrip-route-card-icon">
              <Icon name="directions" size={20} />
            </span>
            <span className="roadtrip-route-card-text">
              {formatDuration(routeInfo.durationSec)} · {firstPlace.name} to {lastPlace.name} · {stopCount} stops
            </span>
          </button>
        )}
      </div>

      <div className="roadtrip-chat-input-row">
        <input className="search-input" placeholder="Ask a question" readOnly />
        <button className="you-bell">
          <Icon name="mic" size={18} />
        </button>
      </div>
    </div>
  )
}
