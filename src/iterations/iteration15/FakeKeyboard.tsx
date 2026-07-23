import { Box } from '@mui/material'
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import MicNoneIcon from '@mui/icons-material/MicNone'
import { MOTION_EMPHASIZED, tokens } from './theme'

const ROW_TOP = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const ROW_MID = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const ROW_BOT = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

const KEY_SHADOW = '0 1px 0 rgba(0, 0, 0, 0.30)'

function Key({ label, wide = false, dim = false }: { label: string; wide?: boolean; dim?: boolean }) {
  return (
    <Box
      sx={{
        flex: wide ? 1.4 : 1,
        height: 42,
        borderRadius: '5px',
        bgcolor: dim ? '#ABB0BA' : '#FFFFFF',
        boxShadow: KEY_SHADOW,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 400,
        color: tokens.ink,
      }}
    >
      {label}
    </Box>
  )
}

// Static iOS-style keyboard (Figma frame 191:4522) — purely decorative. Real
// keystrokes go to the still-focused Ask Maps input; every key here is inert
// (pointerEvents none), so it can never steal the focus it's pretending to own.
export function FakeKeyboard({ visible }: { visible: boolean }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 342,
        zIndex: 8,
        bgcolor: '#D1D4D9',
        pointerEvents: 'none',
        transform: visible ? 'translateY(0)' : 'translateY(105%)',
        transition: `transform 320ms ${MOTION_EMPHASIZED}`,
        display: 'flex',
        flexDirection: 'column',
        px: '6px',
        pt: '10px',
        userSelect: 'none',
      }}
    >
      {/* Suggestion strip */}
      <Box sx={{ display: 'flex', alignItems: 'center', height: 40, mb: '8px' }}>
        {['“The”', 'the', 'to'].map((word, i) => (
          <Box
            key={word}
            sx={{
              flex: 1,
              textAlign: 'center',
              fontSize: 17,
              color: tokens.ink,
              borderRight: i < 2 ? '1px solid rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {word}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: '6px', mb: '10px' }}>
        {ROW_TOP.map((k) => (
          <Key key={k} label={k} />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '6px', mb: '10px', px: '18px' }}>
        {ROW_MID.map((k) => (
          <Key key={k} label={k} />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '6px', mb: '10px', alignItems: 'stretch' }}>
        <Box
          sx={{
            width: 44,
            height: 42,
            borderRadius: '5px',
            bgcolor: '#ABB0BA',
            boxShadow: KEY_SHADOW,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowUpwardIcon sx={{ fontSize: 20, color: tokens.ink }} />
        </Box>
        <Box sx={{ display: 'flex', gap: '6px', flex: 1, px: '8px' }}>
          {ROW_BOT.map((k) => (
            <Key key={k} label={k} />
          ))}
        </Box>
        <Box
          sx={{
            width: 44,
            height: 42,
            borderRadius: '5px',
            bgcolor: '#ABB0BA',
            boxShadow: KEY_SHADOW,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BackspaceOutlinedIcon sx={{ fontSize: 20, color: tokens.ink }} />
        </Box>
      </Box>

      {/* Bottom row: ABC · space · return */}
      <Box sx={{ display: 'flex', gap: '6px' }}>
        <Box
          sx={{
            width: 90,
            height: 42,
            borderRadius: '5px',
            bgcolor: '#ABB0BA',
            boxShadow: KEY_SHADOW,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: tokens.ink,
          }}
        >
          ABC
        </Box>
        <Box
          sx={{
            flex: 1,
            height: 42,
            borderRadius: '5px',
            bgcolor: '#FFFFFF',
            boxShadow: KEY_SHADOW,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: tokens.inkSecondary,
          }}
        >
          space
        </Box>
        <Box
          sx={{
            width: 90,
            height: 42,
            borderRadius: '5px',
            bgcolor: tokens.blue,
            boxShadow: KEY_SHADOW,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <KeyboardReturnIcon sx={{ fontSize: 22, color: '#fff' }} />
        </Box>
      </Box>

      {/* Emoji / dictation strip + home indicator */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '26px',
          color: tokens.inkSecondary,
        }}
      >
        <SentimentSatisfiedAltIcon sx={{ fontSize: 26 }} />
        <MicNoneIcon sx={{ fontSize: 26 }} />
      </Box>
      <Box
        sx={{
          width: 140,
          height: 5,
          borderRadius: 999,
          bgcolor: '#0B0B0C',
          mx: 'auto',
          mb: '8px',
        }}
      />
    </Box>
  )
}
