import { Box } from '@mui/material'
import geminiSpark from '../../../Gemini spark.png'

interface GeminiSparkProps {
  /** Diameter of the spark glyph itself (px). */
  size?: number
  alt?: string
}

// The multicolor four-point Gemini spark from `Gemini spark.png` — same mark
// as iteration 11 so Gemini reads consistently across iterations.
export function GeminiSpark({ size = 22, alt = '' }: GeminiSparkProps) {
  return (
    <Box
      component="img"
      src={geminiSpark}
      alt={alt}
      sx={{ width: size, height: size, display: 'block', flexShrink: 0 }}
    />
  )
}
