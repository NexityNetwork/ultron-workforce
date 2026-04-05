'use client'

import { useEffect, useState } from 'react'

const INITIAL_STARS = '27k'

export function GitHubStars() {
  const [stars, setStars] = useState(INITIAL_STARS)

  useEffect(() => {
    fetch('https://api.github.com/repos/simstudioai/sim', {
      next: { revalidate: 3600 },
    } as RequestInit)
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) {
          const count = data.stargazers_count as number
          if (count >= 1000) {
            setStars(`${(count / 1000).toFixed(1)}k`)
          } else {
            setStars(String(count))
          }
        }
      })
      .catch(() => {
        // Keep default
      })
  }, [])

  return (
    <a
      href='https://github.com/simstudioai/sim'
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-2 px-3'
      aria-label={`GitHub repository — ${stars} stars`}
    >
      <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='h-[14px] w-[14px]'
      >
        <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
      </svg>
      <span aria-live='polite'>{stars}</span>
    </a>
  )
}
