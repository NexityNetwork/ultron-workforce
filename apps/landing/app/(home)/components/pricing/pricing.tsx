interface PricingTier {
  id: string
  name: string
  description: string
  price: string
  billingPeriod?: string
  color: string
  features: string[]
  cta: { label: string; href: string }
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'max',
    name: 'Max',
    description: 'For teams ready to put AI to work',
    price: '$19',
    billingPeriod: 'per month',
    color: '#DA4E24',
    features: [
      '6,000 credits/mo · +50/day',
      '50GB file storage',
      '25 tables · 5,000 rows each',
      '50 min execution · 150 runs/min',
      '50 concurrent/workspace',
      'Unlimited log retention',
      'CLI/SDK/MCP Access',
    ],
    cta: { label: 'Get started', href: 'https://app.51ultron.com/login' },
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'For companies running GTM at full scale',
    price: '$100',
    billingPeriod: 'per month',
    color: '#DA4E24',
    features: [
      '25,000 credits/mo · +200/day',
      '500GB file storage',
      '25 tables · 5,000 rows each',
      '50 min execution · 300 runs/min',
      '200 concurrent/workspace',
      'Unlimited log retention',
      'CLI/SDK/MCP Access',
    ],
    cta: { label: 'Get started', href: 'https://app.51ultron.com/login' },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations that need complete control',
    price: 'Custom',
    color: '#DA4E24',
    features: [
      'Custom credits & infra limits',
      'Custom file storage',
      '10,000 tables · 1M rows each',
      'Custom execution limits',
      'Custom concurrency limits',
      'Unlimited log retention',
      'SSO & SCIM · SOC2',
      'Self hosting · Dedicated support',
    ],
    cta: { label: 'Book a demo', href: 'https://www.51ultron.com/contact/' },
  },
]

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
      <path
        d='M2.5 7L5.5 10L11.5 4'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function Badge({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className ?? ''}`}
      style={style}
    >
      <span className='h-1.5 w-1.5 rounded-full bg-current opacity-70' />
      {children}
    </span>
  )
}

function PricingCard({ tier }: { tier: PricingTier }) {
  const isPro = tier.id === 'max'

  return (
    <article className='flex flex-1 flex-col' aria-labelledby={`${tier.id}-heading`}>
      <div className='flex flex-1 flex-col gap-6 rounded-t-lg border border-[var(--landing-border-light)] border-b-0 bg-white p-5'>
        <div className='flex flex-col'>
          <h3
            id={`${tier.id}-heading`}
            className='font-[430] font-season text-[24px] text-[var(--landing-text-dark)] leading-[100%] tracking-[-0.02em]'
          >
            {tier.name}
          </h3>
          <p className='mt-2 min-h-[44px] font-[430] font-season text-[#5c5c5c] text-sm leading-[125%] tracking-[0.02em]'>
            {tier.description}
          </p>
          <p className='mt-4 flex items-center gap-1.5 font-[430] font-season text-[20px] text-[var(--landing-text-dark)] leading-[100%] tracking-[-0.02em]'>
            {tier.price}
            {tier.billingPeriod && (
              <span className='text-[#737373] text-md'>{tier.billingPeriod}</span>
            )}
          </p>
          <div className='mt-4'>
            {isPro ? (
              <a
                href={tier.cta.href}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-[32px] w-full items-center justify-center rounded-[5px] border border-[#1D1D1D] bg-[#1D1D1D] px-2.5 font-[430] font-season text-[14px] text-white transition-colors hover:border-[var(--landing-border)] hover:bg-[var(--landing-bg-elevated)]'
              >
                {tier.cta.label}
              </a>
            ) : (
              <a
                href={tier.cta.href}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-[32px] w-full items-center justify-center rounded-[5px] border border-[var(--landing-border-light)] px-2.5 font-[430] font-season text-[14px] text-[var(--landing-text-dark)] transition-colors hover:bg-[var(--landing-bg-hover)]'
              >
                {tier.cta.label}
              </a>
            )}
          </div>
        </div>

        <ul className='flex flex-col gap-2'>
          {tier.features.map((feature) => (
            <li key={feature} className='flex items-center gap-2'>
              <CheckIcon color='#404040' />
              <span className='font-[400] font-season text-[#5c5c5c] text-sm leading-[125%] tracking-[0.02em]'>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className='relative h-[6px]'>
        <div
          className='absolute inset-0 rounded-b-sm opacity-60'
          style={{ backgroundColor: tier.color }}
        />
        <div
          className='absolute top-0 right-0 bottom-0 left-[12%] rounded-b-sm opacity-60'
          style={{ backgroundColor: tier.color }}
        />
        <div
          className='absolute top-0 right-0 bottom-0 left-[25%] rounded-b-sm'
          style={{ backgroundColor: tier.color }}
        />
      </div>
    </article>
  )
}

export default function Pricing() {
  return (
    <section
      id='pricing'
      aria-labelledby='pricing-heading'
      className='bg-[var(--landing-bg-section)]'
    >
      <div className='px-4 pt-[60px] pb-16 sm:px-8 sm:pt-20 sm:pb-20 md:px-20 md:pt-[100px] md:pb-24'>
        <div className='flex flex-col items-start gap-3 sm:gap-4 md:gap-5'>
          <Badge
            className='bg-[#DA4E24]/10 font-season text-[#DA4E24] uppercase tracking-[0.02em]'
          >
            Pricing
          </Badge>

          <h2
            id='pricing-heading'
            className='text-balance font-[430] font-season text-[32px] text-[var(--landing-text-dark)] leading-[100%] tracking-[-0.02em] sm:text-[36px] md:text-[40px]'
          >
            Pricing
          </h2>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 md:mt-12 lg:grid-cols-3'>
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  )
}
