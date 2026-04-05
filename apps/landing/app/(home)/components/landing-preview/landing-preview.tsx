'use client'

/**
 * Landing preview placeholder for the standalone landing app.
 * Shows a dark-themed animated placeholder matching the hero section style.
 */
export function LandingPreview() {
  return (
    <div
      className='flex aspect-[1116/549] w-full items-center justify-center overflow-hidden rounded bg-[var(--landing-bg-surface)] antialiased'
      aria-label='Sim workspace preview'
    >
      <div className='flex flex-col items-center gap-4 opacity-30'>
        <svg width='48' height='48' viewBox='0 0 48 48' fill='none' aria-hidden='true'>
          <rect width='48' height='48' rx='10' fill='#701ffc' />
          <path
            d='M16 24C16 19.582 19.582 16 24 16C28.418 16 32 19.582 32 24C32 28.418 28.418 32 24 32'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
          />
          <circle cx='24' cy='24' r='3' fill='white' />
        </svg>
        <span className='font-season text-white text-sm tracking-wide'>Sim</span>
      </div>
    </div>
  )
}
