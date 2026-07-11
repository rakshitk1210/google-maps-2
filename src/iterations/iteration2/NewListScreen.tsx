import { useState } from 'react'
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddReactionIcon from '@mui/icons-material/AddReaction'
import CheckIcon from '@mui/icons-material/Check'

const ICON_OPTIONS = ['😍', '🤡', '📸', '🏖️', '🍽️', '🏔️', '🎉', '📍']

interface NewListScreenProps {
  onClose: () => void
  onCreate: (data: { icon: string; name: string; description: string; type: 'private' | 'shared' }) => void
}

export function NewListScreen({ onClose, onCreate }: NewListScreenProps) {
  const [icon, setIcon] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'private' | 'shared'>('private')

  const cycleIcon = () => {
    const currentIndex = icon ? ICON_OPTIONS.indexOf(icon) : -1
    setIcon(ICON_OPTIONS[(currentIndex + 1) % ICON_OPTIONS.length])
  }

  const canCreate = name.trim().length > 0

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        bgcolor: '#fff',
        px: '20px',
        py: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 26 }}>
          New list
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: '#eee' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        component="button"
        onClick={cycleIcon}
        sx={{
          alignSelf: 'center',
          mt: '24px',
          width: 120,
          height: 120,
          borderRadius: '28px',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #cfe4fc 0%, #f0f0f0 45%, #d3ecd8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#072d24',
          }}
        >
          {icon ? <Typography sx={{ fontSize: 26 }}>{icon}</Typography> : <AddReactionIcon />}
        </Box>
      </Box>
      <Typography sx={{ textAlign: 'center', mt: '10px', color: '#444', fontSize: 14 }}>Choose icon</Typography>

      <TextField
        placeholder="Name this list"
        value={name}
        onChange={(event) => setName(event.target.value)}
        sx={{ mt: '20px' }}
      />
      <TextField
        placeholder="Give this list a description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        sx={{ mt: '20px' }}
      />

      <Typography sx={{ mt: '24px', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', color: '#888' }}>
        LIST TYPE
      </Typography>

      <Box
        component="button"
        onClick={() => setType('private')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          bgcolor: 'transparent',
          border: 'none',
          borderBottom: '1px solid #eee',
          py: '14px',
          textAlign: 'left',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: type === 'private' ? '#0b6858' : '#202124' }}>
            Private
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 14, mt: '2px' }}>
            Only you can view and edit
          </Typography>
        </Box>
        <Box sx={{ width: 20, display: 'flex', justifyContent: 'flex-end', color: '#0b6858' }}>
          {type === 'private' && <CheckIcon fontSize="small" />}
        </Box>
      </Box>

      <Box
        component="button"
        onClick={() => setType('shared')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          bgcolor: 'transparent',
          border: 'none',
          borderBottom: '1px solid #eee',
          py: '14px',
          textAlign: 'left',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: type === 'shared' ? '#0b6858' : '#202124' }}>
            Shared
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 14, mt: '2px' }}>
            Anyone with the link will see the list with your Google Account name and picture
          </Typography>
        </Box>
        <Box sx={{ width: 20, display: 'flex', justifyContent: 'flex-end', color: '#0b6858' }}>
          {type === 'shared' && <CheckIcon fontSize="small" />}
        </Box>
      </Box>

      <Button
        variant="contained"
        disabled={!canCreate}
        onClick={() => onCreate({ icon: icon ?? '😊', name: name.trim(), description: description.trim(), type })}
        sx={{ mt: 'auto', mb: '4px', borderRadius: 999, py: '12px', fontWeight: 600 }}
      >
        Create
      </Button>
    </Box>
  )
}
