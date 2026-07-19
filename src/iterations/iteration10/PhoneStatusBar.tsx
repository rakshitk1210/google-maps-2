import { Box } from '@mui/material'
import statusBar from '../../../Status bar.png'

// iOS-style status bar asset (design.md §1: top overlay zone). Replaces the
// drawn MUI icons so the chrome stays crisp and consistent over the map.
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
