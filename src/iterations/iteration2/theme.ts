import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#1a73e8' },
    secondary: { main: '#0b6858' },
    background: { default: '#e8eaed', paper: '#ffffff' },
    text: { primary: '#202124', secondary: '#666666' },
  },
  typography: {
    fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
  },
  shape: { borderRadius: 12 },
})
