import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import ExploreIcon from '@mui/icons-material/Explore'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import type { Tab } from './GoogleMapsClone'

interface BottomNavProps {
  active: Tab
  onSelect: (tab: Tab) => void
}

export function BottomNav({ active, onSelect }: BottomNavProps) {
  return (
    <BottomNavigation
      value={active}
      onChange={(_event, value: Tab) => onSelect(value)}
      showLabels
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: '#eef1f0',
        borderTop: '1px solid #ddd',
        height: 72,
        '& .Mui-selected': { color: '#072d24' },
      }}
    >
      <BottomNavigationAction label="Explore" value="explore" icon={<ExploreIcon />} />
      <BottomNavigationAction label="You" value="you" icon={<BookmarkIcon />} />
      <BottomNavigationAction label="Contribute" value="contribute" icon={<AddCircleIcon />} />
    </BottomNavigation>
  )
}
