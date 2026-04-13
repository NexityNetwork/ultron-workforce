import { classNames } from './cap-utils'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'flex items-center justify-center transition-colors duration-200 rounded-full disabled:cursor-not-allowed cursor-pointer font-medium px-[1.25rem] ring-offset-transparent relative gap-1',
  {
    defaultVariants: { variant: 'primary', size: 'md' },
    variants: {
      variant: {
        primary: 'bg-gray-12 text-gray-1 disabled:bg-gray-6 disabled:text-gray-9',
        dark: 'bg-gray-12 hover:bg-gray-11 text-gray-1 disabled:text-gray-10 disabled:bg-gray-7',
        outline: 'border border-gray-4 hover:border-gray-5 hover:bg-gray-3 text-gray-12 disabled:bg-gray-8',
        ghost: 'hover:bg-white/20 hover:text-white',
        transparent: 'bg-transparent text-gray-10 hover:underline hover:text-gray-12',
      },
      size: {
        xs: 'text-xs h-[32px]',
        sm: 'text-sm h-[40px]',
        md: 'text-sm h-[44px]',
        lg: 'text-md h-[48px]',
        icon: 'h-9 w-9',
      },
    },
  }
)

const Button = React.forwardRef<HTMLElement, any>(
  ({ className, variant, size, asChild = false, href, children, ...props }, ref) => {
    const Comp = href ? 'a' : asChild ? Slot : 'button'
    return (
      <Comp
        className={classNames(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        href={href || undefined}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

const Switch = React.forwardRef<HTMLButtonElement, any>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={classNames(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-blue-600' : 'bg-gray-4',
          className
        )}
        {...props}
      >
        <span
          className={classNames(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    )
  }
)
Switch.displayName = 'Switch'

export { Button, buttonVariants, Switch }
