'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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
          src='/logo/ultron-nav.svg'
          alt='Ultron'
          width={28}
          height={28}
          className='h-[28px] w-auto'
          priority
        />
      </Link>

      {!logoOnly && (
        <Link
          href='https://ultron.nexity.dev'
          className='inline-flex h-[30px] items-center gap-[7px] rounded-[5px] border border-[var(--white)] bg-transparent px-2.5 text-[13.5px] text-white transition-colors hover:bg-[rgba(255,255,255,0.08)]'
        >
          Try Ultron
        </Link>
      )}
    </nav>
  )
}
