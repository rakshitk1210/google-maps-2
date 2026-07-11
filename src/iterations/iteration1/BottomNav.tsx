import { Icon } from '../../components/Icon'
import type { Tab } from './GoogleMapsClone'

interface BottomNavProps {
  active: Tab
  onSelect: (tab: Tab) => void
}

export function BottomNav({ active, onSelect }: BottomNavProps) {
  return (
    <div className="bottom-nav">
      <button
        className={`bottom-nav-item ${active === 'explore' ? 'active' : ''}`}
        onClick={() => onSelect('explore')}
      >
        <Icon name="explore" size={22} fill={active === 'explore'} />
        <span>Explore</span>
      </button>
      <button
        className={`bottom-nav-item ${active === 'you' ? 'active' : ''}`}
        onClick={() => onSelect('you')}
      >
        <Icon name="bookmark" size={22} fill={active === 'you'} />
        <span>You</span>
      </button>
      <button
        className={`bottom-nav-item ${active === 'contribute' ? 'active' : ''}`}
        onClick={() => onSelect('contribute')}
      >
        <Icon name="add_circle" size={22} fill={active === 'contribute'} />
        <span>Contribute</span>
      </button>
    </div>
  )
}
