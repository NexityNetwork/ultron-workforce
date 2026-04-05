'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { DemoRequestModal } from '@/app/(home)/components/demo-request/demo-request-modal'

interface NavbarProps {
  logoOnly?: boolean
}

export default function Navbar({ logoOnly = false }: NavbarProps) {
  const searchParams = useSearchParams()
  const isBrowsingHome = searchParams.has('home')
  const logoHref = isBrowsingHome ? '/?home' : '/'

  return (
    <nav
      aria-label='Primary navigation'
      className='relative flex h-[52px] items-center justify-between border-[var(--landing-bg-elevated)] border-b-[1px] bg-[var(--landing-bg)] px-5 font-[430] font-season text-[var(--landing-text)] text-sm lg:px-20'
      itemScope
      itemType='https://schema.org/SiteNavigationElement'
    >
      <Link href={logoHref} aria-label='Ultron home' itemProp='url'>
        <span itemProp='name' className='sr-only'>Ultron</span>
        <Image
          src='/logo/sim-landing.svg'
          alt='Ultron'
          width={71}
          height={22}
          className='h-[22px] w-auto'
          priority
        />
      </Link>

      {!logoOnly && (
        <DemoRequestModal>
          <button
            type='button'
            className='inline-flex h-[30px] items-center gap-[7px] rounded-[5px] border border-[var(--white)] bg-[var(--white)] px-2.5 text-[13.5px] text-black transition-colors hover:border-[#E0E0E0] hover:bg-[#E0E0E0]'
            aria-label='Get a demo'
          >
            Get a demo
          </button>
        </DemoRequestModal>
      )}
    </nav>
  )
}
