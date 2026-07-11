import { Icon } from '../../components/Icon'

const CATEGORIES = ['Restaurants', 'Coffee', 'Gas', 'Hotels', 'Groceries', 'Parks']

interface TopBarProps {
  minimal?: boolean
}

export function TopBar({ minimal = false }: TopBarProps) {
  return (
    <div className="top-bar">
      <div className="status-bar">
        <span>3:45</span>
        <span className="status-bar-icons">●●●●</span>
      </div>

      {!minimal && (
        <>
          <div className="search-pill">
            <Icon name="location_on" size={20} className="search-pill-icon" />
            <input className="search-input" placeholder="Search here" readOnly />
            <Icon name="mic" size={20} />
            <Icon name="photo_camera" size={20} />
            <div className="avatar">
              <Icon name="account_circle" size={20} fill />
            </div>
          </div>

          <div className="pill-row">
            <button className="pill pill-ask-maps">
              <Icon name="search" size={16} />
              Ask Maps
            </button>
            {CATEGORIES.map((category) => (
              <button key={category} className="pill">
                {category}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
