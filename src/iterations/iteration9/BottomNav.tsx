import type { ReactElement } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import ExploreIcon from '@mui/icons-material/Explore'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import { tokens } from './theme'

export type Tab = 'explore' | 'contribute' | 'saved' | 'roadtrip'

interface BottomNavProps {
  activeTab: Tab
  onSelectTab: (tab: Tab) => void
}

interface TabSpec {
  id: Tab
  label: string
  icon: ReactElement
  /** Road Trip gets the gem-purple active pill; the rest stay cyan. */
  accent?: boolean
}

const TABS: TabSpec[] = [
  { id: 'explore', label: 'Explore', icon: <ExploreIcon /> },
  { id: 'contribute', label: 'Contribute', icon: <AddCircleOutlineIcon /> },
  { id: 'saved', label: 'Saved', icon: <BookmarkBorderIcon /> },
  { id: 'roadtrip', label: 'Road Trip', icon: <DirectionsCarFilledOutlinedIcon />, accent: true },
]

// design.md §6.4 tab: active gets the 64×32 tonal pill behind a filled icon
// (13/600 label), inactive is a bare outlined icon (13/500 secondary label).
function NavTab({ spec, active, onClick }: { spec: TabSpec; active: boolean; onClick: () => void }) {
  const pillBg = spec.accent ? tokens.purpleContainer : tokens.cyanContainer
  const pillFg = spec.accent ? tokens.purple : tokens.teal
  return (
    <ButtonBase
      onClick={onClick}
      disableRipple
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        pt: active ? 0 : '4px',
        borderRadius: '12px',
      }}
    >
      {active ? (
        <Box
          sx={{
            width: 64,
            height: 32,
            borderRadius: 999,
            bgcolor: pillBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', color: pillFg, '& svg': { fontSize: 24 } }}>{spec.icon}</Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', color: tokens.ink, '& svg': { fontSize: 24 } }}>{spec.icon}</Box>
      )}
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          color: active ? tokens.ink : tokens.inkSecondary,
        }}
      >
        {spec.label}
      </Typography>
    </ButtonBase>
  )
}

// Single 84px bar (design.md §6.4) with the new fourth "Road Trip" destination
// tab from the iteration 9 sketch. Explore and Road Trip drive real views;
// Contribute and Saved are decorative but still take the active pill.
export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 84,
        bgcolor: tokens.surfaceNav,
        display: 'flex',
        justifyContent: 'space-around',
        pt: '8px',
        zIndex: 7,
      }}
    >
      {TABS.map((spec) => (
        <NavTab key={spec.id} spec={spec} active={activeTab === spec.id} onClick={() => onSelectTab(spec.id)} />
      ))}
    </Box>
  )
}
