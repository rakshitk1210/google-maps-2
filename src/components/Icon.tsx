interface IconProps {
  name: string
  size?: number
  fill?: boolean
  weight?: number
  className?: string
}

export function Icon({ name, size = 24, fill = false, weight = 400, className = '' }: IconProps) {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  )
}
