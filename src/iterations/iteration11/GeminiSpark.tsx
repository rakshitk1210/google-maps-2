import { Box } from '@mui/material'
import geminiSpark from '../../../Gemini spark.png'

interface GeminiSparkProps {
  /** Diameter of the spark glyph itself (px). */
  size?: number
  /** When true, nest the spark in a solid white circular badge (CTA treatment). */
  badge?: boolean
  /** Outer diameter when `badge` is set; defaults to size + 8. */
  badgeSize?: number
  alt?: string
}

// Single Gemini mark for iteration 11 — the multicolor four-point spark from
// `Gemini spark.png`. Use `badge` for the "Make it a Road Trip" pill (white
// disc behind the spark); bare spark elsewhere so the mark stays constant.
export function GeminiSpark({ size = 22, badge = false, badgeSize, alt = '' }: GeminiSparkProps) {
  const spark = (
    <Box
      component="img"
      src={geminiSpark}
      alt={alt}
      sx={{ width: size, height: size, display: 'block', flexShrink: 0 }}
    />
  )

  if (!badge) return spark

  const outer = badgeSize ?? size + 8
  return (
    <Box
      sx={{
        width: outer,
        height: outer,
        borderRadius: '50%',
        bgcolor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {spark}
    </Box>
  )
}
