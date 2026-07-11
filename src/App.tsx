import { useState } from 'react'
import { IterationList } from './components/IterationList'
import { PhoneFrame } from './components/PhoneFrame'
import { iterations } from './data/iterations'
import './App.css'

function App() {
  const [selectedId, setSelectedId] = useState(iterations[0].id)

  return (
    <div className="app-shell">
      <IterationList iterations={iterations} selectedId={selectedId} onSelect={setSelectedId} />
      <div className="canvas">
        <PhoneFrame iterationId={selectedId} />
      </div>
    </div>
  )
}

export default App
