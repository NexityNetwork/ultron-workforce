'use client'

import { useCallback, useState } from 'react'

interface DemoRequestModalProps {
  children: React.ReactNode
  theme?: 'dark' | 'light'
}

type DemoRequestField = 'firstName' | 'lastName' | 'companyEmail' | 'phoneNumber' | 'region' | 'companySize' | 'details'
type DemoRequestErrors = Partial<Record<DemoRequestField, string>>

interface DemoRequestFormState {
  firstName: string
  lastName: string
  companyEmail: string
  phoneNumber: string
  region: string
  companySize: string
  details: string
}

const INITIAL_FORM_STATE: DemoRequestFormState = {
  firstName: '',
  lastName: '',
  companyEmail: '',
  phoneNumber: '',
  region: '',
  companySize: '',
  details: '',
}

const REGION_OPTIONS = [
  { value: 'north_america', label: 'North America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia_pacific', label: 'Asia Pacific' },
  { value: 'latin_america', label: 'Latin America' },
  { value: 'middle_east_africa', label: 'Middle East & Africa' },
  { value: 'other', label: 'Other' },
]

const COMPANY_SIZE_OPTIONS = [
  { value: '1_10', label: '1–10' },
  { value: '11_50', label: '11–50' },
  { value: '51_200', label: '51–200' },
  { value: '201_500', label: '201–500' },
  { value: '501_1000', label: '501–1,000' },
  { value: '1001_10000', label: '1,001–10,000' },
  { value: '10000_plus', label: '10,000+' },
]

export function DemoRequestModal({ children, theme = 'dark' }: DemoRequestModalProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<DemoRequestFormState>(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState<DemoRequestErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM_STATE)
    setErrors({})
    setIsSubmitting(false)
    setSubmitError(null)
    setSubmitSuccess(false)
  }, [])

  const updateField = useCallback(
    <TField extends keyof DemoRequestFormState>(
      field: TField,
      value: DemoRequestFormState[TField]
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => {
        if (!prev[field]) return prev
        const next = { ...prev }
        delete next[field]
        return next
      })
      setSubmitError(null)
      setSubmitSuccess(false)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitError(null)
      setSubmitSuccess(false)

      const newErrors: DemoRequestErrors = {}
      if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!form.companyEmail.trim() || !form.companyEmail.includes('@'))
        newErrors.companyEmail = 'Enter a valid work email'
      if (!form.region) newErrors.region = 'Please select a region'
      if (!form.companySize) newErrors.companySize = 'Please select company size'
      if (!form.details.trim()) newErrors.details = 'Details are required'

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      setIsSubmitting(true)
      try {
        const response = await fetch('https://sim.ai/api/demo-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            phoneNumber: form.phoneNumber || undefined,
          }),
        })
        if (!response.ok) throw new Error('Failed to submit demo request')
        setSubmitSuccess(true)
      } catch (error) {
        setSubmitError('Failed to submit demo request. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [form]
  )

  const isDark = theme === 'dark'

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ display: 'contents' }}>
        {children}
      </span>

      {open && (
        <div
          className='fixed inset-0 z-[200] flex items-center justify-center p-4'
          role='dialog'
          aria-modal='true'
          aria-label='Request a demo'
        >
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
            onClick={() => { setOpen(false); resetForm() }}
          />

          {/* Modal */}
          <div
            className={`relative z-10 w-full max-w-lg overflow-hidden rounded-xl border shadow-overlay ${
              isDark
                ? 'border-[#3d3d3d] bg-[#1c1c1c] text-white'
                : 'border-[#e5e5e5] bg-white text-[#1c1c1c]'
            }`}
          >
            <div className='flex items-center justify-between border-b border-inherit px-6 py-4'>
              <h2 className='font-[430] font-season text-lg leading-none'>
                {submitSuccess ? 'Demo request submitted' : 'Nearly there!'}
              </h2>
              <button
                type='button'
                onClick={() => { setOpen(false); resetForm() }}
                className='flex h-7 w-7 items-center justify-center rounded opacity-60 transition-opacity hover:opacity-100'
                aria-label='Close'
              >
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                  <path d='M1 1L11 11M11 1L1 11' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                </svg>
              </button>
            </div>

            {submitSuccess ? (
              <div className='flex flex-col items-center justify-center px-6 py-12 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full border border-current/20'>
                  <svg width='28' height='28' viewBox='0 0 28 28' fill='none'>
                    <path d='M5 14L10.5 19.5L23 7' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </div>
                <h3 className='mt-6 font-[430] font-season text-[28px] leading-tight tracking-[-0.02em]'>
                  We’ll be in touch soon!
                </h3>
                <p className='mt-3 text-sm opacity-60'>
                  Our team will be in touch soon. If you have any questions, email us at{' '}
                  <a href='mailto:enterprise@sim.ai' className='underline underline-offset-2'>
                    enterprise@sim.ai
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='flex flex-col'>
                <div className='space-y-4 px-6 py-5'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='flex flex-col gap-1.5'>
                      <label className='text-xs opacity-60'>First name</label>
                      <input
                        value={form.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        placeholder='First'
                        className={`h-9 rounded-md border px-3 text-sm outline-none ${
                          isDark ? 'border-[#3d3d3d] bg-[#232323]' : 'border-[#e5e5e5] bg-white'
                        } ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && <p className='text-xs text-red-500'>{errors.firstName}</p>}
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <label className='text-xs opacity-60'>Last name</label>
                      <input
                        value={form.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        placeholder='Last'
                        className={`h-9 rounded-md border px-3 text-sm outline-none ${
                          isDark ? 'border-[#3d3d3d] bg-[#232323]' : 'border-[#e5e5e5] bg-white'
                        } ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && <p className='text-xs text-red-500'>{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs opacity-60'>Company email</label>
                    <input
                      type='email'
                      value={form.companyEmail}
                      onChange={(e) => updateField('companyEmail', e.target.value)}
                      placeholder='Your work email'
                      className={`h-9 rounded-md border px-3 text-sm outline-none ${
                        isDark ? 'border-[#3d3d3d] bg-[#232323]' : 'border-[#e5e5e5] bg-white'
                      } ${errors.companyEmail ? 'border-red-500' : ''}`}
                    />
                    {errors.companyEmail && <p className='text-xs text-red-500'>{errors.companyEmail}</p>}
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs opacity-60'>Phone number <span className='opacity-50'>(optional)</span></label>
                    <input
                      type='tel'
                      value={form.phoneNumber}
                      onChange={(e) => updateField('phoneNumber', e.target.value)}
                      placeholder='Your phone number'
                      className={`h-9 rounded-md border px-3 text-sm outline-none ${
                        isDark ? 'border-[#3d3d3d] bg-[#232323]' : 'border-[#e5e5e5] bg-white'
                      }`}
                    />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='flex flex-col gap-1.5'>
                      <label className='text-xs opacity-60'>Region</label>
                      <select
                        value={form.region}
                        onChange={(e) => updateField('region', e.target.value)}
                        className={`h-9 rounded-md border px-3 text-sm outline-none ${
                          isDark ? 'border-[#3d3d3d] bg-[#232323]' : 'border-[#e5e5e5] bg-white'
                        } ${errors.region ? 'border-red-500' : ''}`}
                      >
                        <option value=''>Select</option>
                        {REGION_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {errors.region && <p className='text-xs text-red-500'>{errors.region}</p>}
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <label className='text-xs opacity-60'>Company size</label>
                      <select
                        value={form.companySize}
                        onChange={(e) => updateField('companySize', e.target.value)}
                        className={`h-9 rounded-md border px-3 text-sm outline-none ${
                          isDark ? 'border-[#3d3d3d] bg-[#232323]' : 'border-[#e5e5e5] bg-white'
                        } ${errors.companySize ? 'border-red-500' : ''}`}
                      >
                        <option value=''>Select</option>
                        {COMPANY_SIZE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {errors.companySize && <p className='text-xs text-red-500'>{errors.companySize}</p>}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs opacity-60'>Details</label>
                    <textarea
                      value={form.details}
                      onChange={(e) => updateField('details', e.target.value)}
                      placeholder='Tell us about your needs and questions'
                      rows={3}
                      className={`rounded-md border px-3 py-2 text-sm outline-none resize-none ${
                        isDark ? 'border-[#3d3d3d] bg-[#232323]' : 'border-[#e5e5e5] bg-white'
                      } ${errors.details ? 'border-red-500' : ''}`}
                    />
                    {errors.details && <p className='text-xs text-red-500'>{errors.details}</p>}
                  </div>
                </div>

                <div className='border-t border-inherit px-6 py-4'>
                  {submitError && <p className='mb-3 text-xs text-red-500'>{submitError}</p>}
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={`flex h-9 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      isDark
                        ? 'bg-white text-black hover:bg-[#e0e0e0]'
                        : 'bg-[#1c1c1c] text-white hover:bg-[#2a2a2a]'
                    } disabled:opacity-50`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
