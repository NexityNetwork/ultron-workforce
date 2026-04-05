import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const STATUS_BASE = 'gap-1.5 rounded-md'

const badgeVariants = cva(
  'inline-flex items-center font-medium focus:outline-none transition-colors',
  {
    variants: {
      variant: {
        default:
          'gap-1 rounded-[40px] border border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface-4)]',
        outline:
          'gap-1 rounded-[40px] border border-[var(--border-1)] bg-transparent text-[var(--text-secondary)]',
        type: 'gap-1 rounded-[40px] border border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface-4)]',
        green: `${STATUS_BASE} bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]`,
        red: `${STATUS_BASE} bg-[var(--badge-error-bg)] text-[var(--badge-error-text)]`,
        gray: `${STATUS_BASE} bg-[var(--badge-gray-bg)] text-[var(--badge-gray-text)]`,
        blue: `${STATUS_BASE} bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)]`,
        'blue-secondary': `${STATUS_BASE} bg-[var(--badge-blue-secondary-bg)] text-[var(--badge-blue-secondary-text)]`,
        purple: `${STATUS_BASE} bg-[var(--badge-purple-bg)] text-[var(--badge-purple-text)]`,
        orange: `${STATUS_BASE} bg-[var(--badge-orange-bg)] text-[var(--badge-orange-text)]`,
        amber: `${STATUS_BASE} bg-[var(--badge-amber-bg)] text-[var(--badge-amber-text)]`,
        teal: `${STATUS_BASE} bg-[var(--badge-teal-bg)] text-[var(--badge-teal-text)]`,
        cyan: `${STATUS_BASE} bg-[var(--badge-cyan-bg)] text-[var(--badge-cyan-text)]`,
        pink: `${STATUS_BASE} bg-[var(--badge-pink-bg)] text-[var(--badge-pink-text)]`,
        'gray-secondary': `${STATUS_BASE} bg-[var(--surface-4)] text-[var(--text-secondary)]`,
      },
      size: {
        sm: 'px-[7px] py-[1px] text-xs',
        md: 'px-[9px] py-0.5 text-[12px]',
        lg: 'px-[9px] py-[2.25px] text-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const STATUS_VARIANTS = [
  'green', 'red', 'gray', 'blue', 'blue-secondary', 'purple',
  'orange', 'amber', 'teal', 'cyan', 'pink', 'gray-secondary',
] as const

const DOT_SIZES: Record<string, string> = {
  sm: 'w-[5px] h-[5px]',
  md: 'w-1.5 h-1.5',
  lg: 'w-1.5 h-1.5',
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export function Badge({ className, variant, size, dot = false, icon: Icon, children, ...props }: BadgeProps) {
  const isStatusVariant = STATUS_VARIANTS.includes(variant as (typeof STATUS_VARIANTS)[number])
  const effectiveSize = size ?? 'md'

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {isStatusVariant && dot && (
        <div className={cn('rounded-sm bg-current', DOT_SIZES[effectiveSize])} />
      )}
      {Icon && <Icon className='w-3 h-3' />}
      {children}
    </div>
  )
}

export { badgeVariants }
