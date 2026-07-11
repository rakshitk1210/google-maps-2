import { Icon } from '../../components/Icon'
import { SUGGESTED_PLACES, formatNames, type ListPlace, type MapsList } from './lists'

interface ListDetailSheetProps {
  list: MapsList
  onClose: () => void
  onAddPlace: (place: ListPlace) => void
  onAddPlaces: () => void
  onInviteCollaborators: () => void
  onPlanRoadtrip: () => void
}

export function ListDetailSheet({
  list,
  onClose,
  onAddPlace,
  onAddPlaces,
  onInviteCollaborators,
  onPlanRoadtrip,
}: ListDetailSheetProps) {
  const suggestions = SUGGESTED_PLACES.filter(
    (place) => !list.places.some((added) => added.name === place.name)
  )
  const names = formatNames(['Rakshit', ...list.collaborators])

  return (
    <div className="list-detail-sheet">
      <div className="you-sheet-handle" />

      <div className="list-detail-header">
        <span className="list-detail-emoji">{list.icon}</span>
        <div className="list-detail-actions">
          <button className="you-bell">
            <Icon name="more_horiz" size={18} />
          </button>
          <button className="you-bell">
            <Icon name="ios_share" size={18} />
          </button>
          <button className="you-bell" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
      </div>

      <h1 className="list-detail-title">{list.name}</h1>
      <div className="list-detail-meta" key={`${names}-${list.places.length}`}>
        {names} · {list.places.length} places
      </div>

      <div className="list-detail-buttons">
        <button className="list-detail-pill" onClick={onInviteCollaborators}>
          <Icon name="person_add" size={18} />
          Invite collaborators
        </button>
        <button className="list-detail-pill" onClick={onAddPlaces}>
          <Icon name="add" size={18} />
          Add places
        </button>
        <button className="list-detail-pill" onClick={onPlanRoadtrip} disabled={list.places.length === 0}>
          <Icon name="route" size={18} />
          Plan a roadtrip
        </button>
      </div>

      {list.places.map((place) => (
        <div key={place.name} className="list-detail-place-card">
          <div className="list-detail-place-header">
            <div className="list-detail-place-name">{place.name}</div>
            <button className="list-detail-place-edit">
              <Icon name="edit" size={16} />
            </button>
          </div>
          <div className="list-detail-place-meta">
            {place.rating ? `${place.rating} ★ (${place.reviews}) · ${place.category}` : place.category}
          </div>
          <div className="list-detail-place-photos">
            {[1, 2, 3].map((n) => (
              <img
                key={n}
                className="list-detail-place-photo"
                src={`https://picsum.photos/seed/${encodeURIComponent(place.name)}-${n}/300/220`}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
          <div className="list-detail-place-caption">Place added by Rakshit Keswani · Just now</div>
          <div className="list-detail-place-react">
            <Icon name="favorite" size={18} />
            Press and hold to react
          </div>
        </div>
      ))}

      <div className="list-detail-suggested-header">
        <h3>Suggested places</h3>
        <p>Recently viewed or similar to places in this list</p>
      </div>

      {suggestions.map((place) => (
        <div key={place.name} className="you-place-card">
          <div className="you-place-thumb" />
          <div className="you-place-info">
            <div className="you-place-title">{place.name}</div>
            <div className="you-place-subtitle">
              {place.rating ? `${place.rating} ★ (${place.reviews}) · ${place.category}` : place.category}
            </div>
          </div>
          <button className="list-detail-add-btn" onClick={() => onAddPlace(place)}>
            <Icon name="add" size={16} />
            Add
          </button>
        </div>
      ))}
    </div>
  )
}
