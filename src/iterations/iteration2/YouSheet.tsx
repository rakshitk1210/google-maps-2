import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import type { MapsList } from './lists'

const FILTERS = ['Saved', 'Area', 'Category', 'Maps history']

interface YouSheetProps {
  lists: MapsList[]
  onNewList: () => void
  onOpenList: (id: string) => void
}

export function YouSheet({ lists, onNewList, onOpenList }: YouSheetProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 70,
        top: '40%',
        zIndex: 5,
        borderRadius: '20px 20px 0 0',
        px: '20px',
        pt: '10px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ width: 36, height: 4, bgcolor: '#ccc', borderRadius: 999, mx: 'auto', mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: 30 }}>
          You
        </Typography>
        <IconButton sx={{ bgcolor: '#eee' }}>
          <NotificationsIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ mt: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 21 }}>
          Your recent places
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          From your Maps history and saves
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: '16px', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
      >
        <IconButton sx={{ bgcolor: '#eee', flexShrink: 0 }}>
          <SearchIcon fontSize="small" />
        </IconButton>
        {FILTERS.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            deleteIcon={<ExpandMoreIcon />}
            onDelete={() => {}}
            sx={{ bgcolor: '#eee', flexShrink: 0 }}
          />
        ))}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mt: '20px' }}>
        <Box sx={{ width: 56, height: 56, borderRadius: '10px', bgcolor: '#333', flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 600 }}>Langley, WA 98260</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Locality
          </Typography>
          <Typography sx={{ fontSize: 13, mt: '2px' }}>🤡 We are a joke</Typography>
        </Box>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#a9d6cd',
            color: '#072d24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckIcon fontSize="small" />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '24px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 21 }}>
          Your lists
        </Typography>
        <Button
          onClick={onNewList}
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#a9d6cd', color: '#072d24', borderRadius: 999, px: 2, fontWeight: 600 }}
        >
          New list
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', pb: '16px' }}>
        {lists.map((list) => (
          <Box
            key={list.id}
            component="button"
            onClick={() => onOpenList(list.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              bgcolor: 'transparent',
              border: 'none',
              borderTop: '1px solid #eee',
              py: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#3c4043',
              font: 'inherit',
            }}
          >
            <Typography sx={{ fontSize: 28, width: 32, textAlign: 'center' }}>{list.icon}</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{list.name}</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                {list.type === 'private' ? 'Private list' : 'Shared list'} · {list.places.length} places
              </Typography>
            </Box>
            <MoreVertIcon />
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
