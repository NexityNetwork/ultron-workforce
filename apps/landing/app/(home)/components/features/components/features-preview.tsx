'use client'

import Image from 'next/image'

const FEATURE_IMAGES: Record<number, string> = {
  0: '/landing/features-mothership.png',
  1: '/landing/features-tables.png',
  2: '/landing/features-files.png',
  3: '/landing/features-knowledge.png',
  4: '/landing/features-logs.png',
}

interface FeaturesPreviewProps {
  activeTab: number
}

export function FeaturesPreview({ activeTab }: FeaturesPreviewProps) {
  const src = FEATURE_IMAGES[activeTab]

  return (
    <div className='relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-lg border border-[var(--divider)] bg-[var(--landing-bg)] lg:h-[560px]'>
      {src ? (
        <Image
          src={src}
          alt={`Feature preview for tab ${activeTab}`}
          fill
          className='object-cover object-top'
          priority={activeTab === 0}
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center'>
          <p className='font-[430] font-season text-[var(--landing-text-muted)] text-sm'>
            Coming soon
          </p>
        </div>
      )}
    </div>
  )
}
