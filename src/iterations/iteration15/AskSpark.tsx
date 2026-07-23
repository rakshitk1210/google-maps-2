import sparkBlue from './assets/spark-blue.svg'
import sparkWhite from './assets/spark-white.svg'

// The four-point "Google AI" spark from the Ask Maps designs (Figma node
// 187:2470) — flat blue on light surfaces, white on the gradient pill.
export function AskSpark({ size = 20, tone = 'blue' }: { size?: number; tone?: 'blue' | 'white' }) {
  return (
    <img
      src={tone === 'white' ? sparkWhite : sparkBlue}
      alt=""
      width={size}
      height={size}
      // The exported vector fills ~70% of its icon frame; padding keeps the
      // same optical size as the Figma instances.
      style={{ display: 'block', padding: size * 0.15, boxSizing: 'border-box' }}
    />
  )
}
