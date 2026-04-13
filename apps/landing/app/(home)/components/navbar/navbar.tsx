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
      className='relative z-50 flex h-[52px] items-center justify-between bg-transparent px-5 font-[430] font-season text-[var(--landing-text)] text-sm lg:px-20'
      itemScope
      itemType='https://schema.org/SiteNavigationElement'
    >
      <Link href={logoHref} aria-label='Ultron home' itemProp='url'>
        <span itemProp='name' className='sr-only'>Ultron</span>
        <Image
          src='/newlogo.png'
          alt='Ultron'
          width={28}
          height={28}
          className='h-[28px] w-[28px] rounded-md'
          priority
        />
      </Link>

      {!logoOnly && (
        <a
          href='https://app.51ultron.com/signup'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex h-[30px] items-center gap-[7px] rounded-[5px] border border-[var(--white)] bg-[var(--white)] px-2.5 text-[13.5px] text-black transition-colors hover:border-[#E0E0E0] hover:bg-[#E0E0E0]'
        >
          Try Ultron
        </a>
      )}
    </nav>
  )
}
