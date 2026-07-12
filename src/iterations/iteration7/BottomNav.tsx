import type { ReactElement } from 'react'
import { Box, Typography } from '@mui/material'
import ExploreIcon from '@mui/icons-material/Explore'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import { EASE_OUT, MODE_TRANSITION, NAV_SWAP_MS, useTokens } from './theme'

interface BottomNavProps {
  roadTrip: boolean
}

interface TabSpec {
  label: string
  icon: ReactElement
  active?: boolean
}

// design.md §6.4 tab: active gets the 64×32 tonal pill behind a filled icon
// (13/600 label), inactive is a bare outlined icon (13/500 secondary label).
function NavTab({ label, icon, active }: TabSpec) {
  const t = useTokens()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        pt: active ? 0 : '4px',
      }}
    >
      {active ? (
        <Box
          sx={{
            width: 64,
            height: 32,
            borderRadius: 999,
            bgcolor: t.cyanContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: MODE_TRANSITION,
          }}
        >
          <Box sx={{ display: 'flex', color: t.teal, transition: MODE_TRANSITION, '& svg': { fontSize: 24 } }}>
            {icon}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', color: t.ink, transition: MODE_TRANSITION, '& svg': { fontSize: 24 } }}>
          {icon}
        </Box>
      )}
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          color: active ? t.ink : t.inkSecondary,
          transition: MODE_TRANSITION,
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

function NavBar({ tabs, shown }: { tabs: TabSpec[]; shown: boolean }) {
  const t = useTokens()
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 84,
        bgcolor: t.surfaceNav,
        display: 'flex',
        justifyContent: 'space-around',
        pt: '8px',
        transition: `transform ${NAV_SWAP_MS}ms ${EASE_OUT}, ${MODE_TRANSITION}`,
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
      }}
    >
      {tabs.map((tab) => (
        <NavTab key={tab.label} {...tab} />
      ))}
    </Box>
  )
}

// Both 84px bars (design.md §6.4) stay mounted, stacked at the bottom of the
// screen. On mode switch the outgoing bar slides down below the frame while
// the incoming one slides up — 350ms ease-out per the iteration 7 sketch —
// and rapid re-toggles simply reverse the transforms.
export function BottomNav({ roadTrip }: BottomNavProps) {
  return (
    <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, zIndex: 3, overflow: 'hidden' }}>
      <NavBar
        shown={!roadTrip}
        tabs={[
          { label: 'Explore', icon: <ExploreIcon />, active: true },
          { label: 'Lists', icon: <BookmarkBorderIcon /> },
          { label: 'Contribute', icon: <AddCircleOutlineIcon /> },
        ]}
      />
      <NavBar
        shown={roadTrip}
        tabs={[
          { label: 'Explore', icon: <ExploreIcon />, active: true },
          { label: 'Friends', icon: <GroupAddOutlinedIcon /> },
          { label: 'Capture', icon: <PhotoCameraOutlinedIcon /> },
        ]}
      />
    </Box>
  )
}
