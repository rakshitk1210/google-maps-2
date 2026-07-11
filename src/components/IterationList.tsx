import type { Iteration } from '../data/iterations'

interface IterationListProps {
  iterations: Iteration[]
  selectedId: number
  onSelect: (id: number) => void
}

export function IterationList({ iterations, selectedId, onSelect }: IterationListProps) {
  return (
    <div className="iteration-list">
      <h2 className="iteration-list-title">Iteration</h2>
      <div className="iteration-list-items">
        {iterations.map((iteration) => (
          <button
            key={iteration.id}
            className={`iteration-item ${iteration.id === selectedId ? 'selected' : ''}`}
            onClick={() => onSelect(iteration.id)}
          >
            {iteration.label}
          </button>
        ))}
      </div>
    </div>
  )
}
