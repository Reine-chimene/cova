export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined
  if (!url || url.trim() === '') {
    return ''
  }
  return url.replace(/\/$/, '')
}
