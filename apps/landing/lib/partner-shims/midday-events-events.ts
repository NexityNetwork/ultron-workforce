export const LogEvents = new Proxy(
  {} as Record<string, { name: string; channel: string }>,
  { get: () => ({ name: '', channel: '' }) }
)
