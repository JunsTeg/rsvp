interface Props {
  readonly variant?: 'color' | 'white'
  readonly className?: string
}

export default function SetectLogo({ variant = 'color', className = '' }: Props) {
  return (
    <img
      src="/logo.svg"
      alt="SETECT — Secure and Protect Your Data"
      className={className}
      style={variant === 'white' ? { filter: 'brightness(0) invert(1)' } : undefined}
    />
  )
}
