import { Box, ButtonBase, Typography } from '@mui/material'
import { CATEGORIES } from './tripData'
import { tokens } from './theme'

interface CategoryChipsProps {
  selected: string
  onSelect: (category: string) => void
}

// Horizontal filter chips over the curated places list (design.md §6.2 chip
// anatomy at sheet scale). The selected chip takes the cyan tonal fill.
export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {CATEGORIES.map((category) => {
        const active = selected === category
        return (
          <ButtonBase
            key={category}
            onClick={() => onSelect(category)}
            sx={{
              height: 36,
              px: '16px',
              borderRadius: 999,
              flexShrink: 0,
              bgcolor: active ? tokens.cyanContainer : tokens.surface,
              border: `1px solid ${active ? tokens.cyanContainer : tokens.hairline}`,
              transition: `background-color 200ms, border-color 200ms`,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? tokens.onCyan : tokens.ink,
              }}
            >
              {category}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}
