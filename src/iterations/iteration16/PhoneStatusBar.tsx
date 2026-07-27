import { Box } from '@mui/material'
import statusBar from '../../../Status bar.png'

// iOS-style status bar asset (design.md §1: top overlay zone), shared with the
// other portrait iterations so the chrome stays crisp over the map.
export function PhoneStatusBar() {
  return (
    <Box
      component="img"
      src={statusBar}
      alt=""
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 'auto',
        display: 'block',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  )
}

/** iOS home indicator — present on every iteration-16 Figma frame. */
export function HomeIndicator({ dark = true }: { dark?: boolean }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 144,
        height: 5,
        borderRadius: '100px',
        bgcolor: dark ? '#000' : '#fff',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    />
  )
}
