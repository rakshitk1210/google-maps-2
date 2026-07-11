import { createRoot } from 'react-dom/client'
import 'material-symbols/rounded.css'
import './index.css'
import App from './App.tsx'

// Note: not wrapped in <StrictMode> — its dev-only double mount/unmount
// crashes mapbox-gl-js (it doesn't tolerate being torn down and
// re-initialized rapidly), which otherwise blanks the whole page in dev.
createRoot(document.getElementById('root')!).render(<App />)
