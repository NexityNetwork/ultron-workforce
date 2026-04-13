/** No-op stub for @midday/events — analytics tracking is irrelevant on our site */
export function track(_payload: Record<string, unknown>) {}
export const LogEvents = new Proxy(
  {},
  {
    get: () => ({ name: '', channel: '' }),
  }
) as Record<string, { name: string; channel: string }>
