import { useState } from 'react'
import { Icon } from '../../components/Icon'

const ICON_OPTIONS = ['😍', '🤡', '📸', '🏖️', '🍽️', '🏔️', '🎉', '📍']

interface NewListScreenProps {
  onClose: () => void
  onCreate: (data: { icon: string; name: string; description: string; type: 'private' | 'shared' }) => void
}

export function NewListScreen({ onClose, onCreate }: NewListScreenProps) {
  const [icon, setIcon] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'private' | 'shared'>('private')

  const cycleIcon = () => {
    const currentIndex = icon ? ICON_OPTIONS.indexOf(icon) : -1
    setIcon(ICON_OPTIONS[(currentIndex + 1) % ICON_OPTIONS.length])
  }

  const canCreate = name.trim().length > 0

  return (
    <div className="new-list-screen">
      <div className="new-list-header">
        <h2>New list</h2>
        <button className="you-bell" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <button className="new-list-icon-picker" onClick={cycleIcon}>
        <span className="new-list-icon-badge">
          {icon ? <span className="new-list-icon-emoji">{icon}</span> : <Icon name="add_reaction" size={22} />}
        </span>
      </button>
      <div className="new-list-icon-label">Choose icon</div>

      <input
        className="new-list-input"
        placeholder="Name this list"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        className="new-list-input"
        placeholder="Give this list a description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="new-list-type-label">LIST TYPE</div>
      <button className="new-list-type-option" onClick={() => setType('private')}>
        <div className="new-list-type-text">
          <div className={`new-list-type-title ${type === 'private' ? 'selected' : ''}`}>Private</div>
          <div className="new-list-type-desc">Only you can view and edit</div>
        </div>
        <span className="new-list-type-check">{type === 'private' && <Icon name="check" size={20} />}</span>
      </button>
      <button className="new-list-type-option" onClick={() => setType('shared')}>
        <div className="new-list-type-text">
          <div className={`new-list-type-title ${type === 'shared' ? 'selected' : ''}`}>Shared</div>
          <div className="new-list-type-desc">
            Anyone with the link will see the list with your Google Account name and picture
          </div>
        </div>
        <span className="new-list-type-check">{type === 'shared' && <Icon name="check" size={20} />}</span>
      </button>

      <button
        className="new-list-create-btn"
        disabled={!canCreate}
        onClick={() => onCreate({ icon: icon ?? '😊', name: name.trim(), description: description.trim(), type })}
      >
        Create
      </button>
    </div>
  )
}
