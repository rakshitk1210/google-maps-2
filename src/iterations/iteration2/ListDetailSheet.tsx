import { Box, Button, Fade, IconButton, Paper, Typography } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IosShareIcon from '@mui/icons-material/IosShare'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AddIcon from '@mui/icons-material/Add'
import RouteIcon from '@mui/icons-material/Route'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { SUGGESTED_PLACES, formatNames, type ListPlace, type MapsList } from './lists'

interface ListDetailSheetProps {
  list: MapsList
  onClose: () => void
  onAddPlace: (place: ListPlace) => void
  onAddPlaces: () => void
  onInviteCollaborators: () => void
  onPlanRoadtrip: () => void
}

export function ListDetailSheet({
  list,
  onClose,
  onAddPlace,
  onAddPlaces,
  onInviteCollaborators,
  onPlanRoadtrip,
}: ListDetailSheetProps) {
  const suggestions = SUGGESTED_PLACES.filter(
    (place) => !list.places.some((added) => added.name === place.name)
  )
  const names = formatNames(['Rakshit', ...list.collaborators])

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

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 32 }}>{list.icon}</Typography>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <IconButton sx={{ bgcolor: '#eee' }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ bgcolor: '#eee' }}>
            <IosShareIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ bgcolor: '#eee' }} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: 30, mt: '16px', mb: '4px' }}>
        {list.name}
      </Typography>
      <Fade in key={`${names}-${list.places.length}`} timeout={200}>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          {names} · {list.places.length} places
        </Typography>
      </Fade>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: '16px' }}>
        <Button
          onClick={onInviteCollaborators}
          startIcon={<PersonAddIcon />}
          sx={{ bgcolor: '#a9d6cd', color: '#072d24', borderRadius: 999, px: 2, fontWeight: 600 }}
        >
          Invite collaborators
        </Button>
        <Button
          onClick={onAddPlaces}
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#a9d6cd', color: '#072d24', borderRadius: 999, px: 2, fontWeight: 600 }}
        >
          Add places
        </Button>
        <Button
          onClick={onPlanRoadtrip}
          disabled={list.places.length === 0}
          startIcon={<RouteIcon />}
          sx={{
            bgcolor: '#a9d6cd',
            color: '#072d24',
            borderRadius: 999,
            px: 2,
            fontWeight: 600,
            '&.Mui-disabled': { bgcolor: '#eee', color: '#999' },
          }}
        >
          Plan a roadtrip
        </Button>
      </Box>

      {list.places.map((place) => (
        <Box key={place.name} sx={{ mt: '20px', pt: '20px', borderTop: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{place.name}</Typography>
            <IconButton sx={{ bgcolor: '#eee' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 14, mt: '2px' }}>
            {place.rating ? `${place.rating} ★ (${place.reviews}) · ${place.category}` : place.category}
          </Typography>
          <Box sx={{ display: 'flex', gap: '6px', mt: '12px' }}>
            {[1, 2, 3].map((n) => (
              <Box
                key={n}
                component="img"
                src={`https://picsum.photos/seed/${encodeURIComponent(place.name)}-${n}/300/220`}
                loading="lazy"
                sx={{ flex: 1, width: 0, height: 110, borderRadius: '10px', objectFit: 'cover' }}
              />
            ))}
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 13, mt: '10px' }}>
            Place added by Rakshit Keswani · Just now
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '10px', color: '#444', fontSize: 14 }}>
            <FavoriteBorderIcon fontSize="small" />
            Press and hold to react
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: '24px' }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, mb: '4px' }}>Suggested places</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 13, mb: '8px' }}>
          Recently viewed or similar to places in this list
        </Typography>
      </Box>

      {suggestions.map((place) => (
        <Box key={place.name} sx={{ display: 'flex', alignItems: 'center', gap: '12px', mt: '20px' }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '10px', bgcolor: '#333', flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{place.name}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              {place.rating ? `${place.rating} ★ (${place.reviews}) · ${place.category}` : place.category}
            </Typography>
          </Box>
          <Button
            onClick={() => onAddPlace(place)}
            startIcon={<AddIcon fontSize="small" />}
            size="small"
            sx={{ bgcolor: '#a9d6cd', color: '#072d24', borderRadius: 999, px: 1.5, fontWeight: 600, flexShrink: 0 }}
          >
            Add
          </Button>
        </Box>
      ))}
    </Paper>
  )
}
