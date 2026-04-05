'use client'

import Image from 'next/image'

/**
 * Simplified landing preview for the standalone landing app.
 * Shows a static screenshot of the Sim workspace.
 */
export function LandingPreview() {
  return (
    <div className='dark flex aspect-[1116/549] w-full overflow-hidden rounded bg-[var(--landing-bg-surface)] antialiased'>
      <div className='relative flex-1'>
        <Image
          src='/landing/preview.png'
          alt='Sim workspace — visual agent builder with workflow canvas, sidebar, and panel'
          fill
          className='object-cover object-top'
          priority
        />
      </div>
    </div>
  )
}
