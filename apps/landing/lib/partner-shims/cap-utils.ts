import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function classNames(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
