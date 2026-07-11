import { Icon } from '../../components/Icon'
import type { MapsList } from './lists'

const FILTERS = ['Saved', 'Area', 'Category', 'Maps history']

interface YouSheetProps {
  lists: MapsList[]
  onNewList: () => void
  onOpenList: (id: string) => void
}

export function YouSheet({ lists, onNewList, onOpenList }: YouSheetProps) {
  return (
    <div className="you-sheet">
      <div className="you-sheet-handle" />

      <div className="you-sheet-header">
        <h2>You</h2>
        <button className="you-bell">
          <Icon name="notifications" size={18} />
        </button>
      </div>

      <div className="you-sheet-subheader">
        <h3>Your recent places</h3>
        <p>From your Maps history and saves</p>
      </div>

      <div className="you-filters">
        <button className="you-filter-search">
          <Icon name="search" size={18} />
        </button>
        {FILTERS.map((filter) => (
          <button key={filter} className="you-filter-chip">
            {filter}
            <Icon name="expand_more" size={14} />
          </button>
        ))}
      </div>

      <div className="you-place-card">
        <div className="you-place-thumb" />
        <div className="you-place-info">
          <div className="you-place-title">Langley, WA 98260</div>
          <div className="you-place-subtitle">Locality</div>
          <div className="you-place-note">🤡 We are a joke</div>
        </div>
        <div className="you-place-saved">
          <Icon name="check" size={16} />
        </div>
      </div>

      <div className="you-lists-header">
        <h3>Your lists</h3>
        <button className="you-new-list-btn" onClick={onNewList}>
          <Icon name="add" size={16} />
          New list
        </button>
      </div>

      <div className="you-lists">
        {lists.map((list) => (
          <button key={list.id} className="you-list-row" onClick={() => onOpenList(list.id)}>
            <span className="you-list-icon">{list.icon}</span>
            <div className="you-list-info">
              <div className="you-list-name">{list.name}</div>
              <div className="you-list-meta">
                {list.type === 'private' ? 'Private list' : 'Shared list'} · {list.places.length} places
              </div>
            </div>
            <Icon name="more_vert" size={20} />
          </button>
        ))}
      </div>
    </div>
  )
}
