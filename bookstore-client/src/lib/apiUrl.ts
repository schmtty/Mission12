/**
 * Prefix for API calls. Empty in local dev (Vite proxies `/api` to the backend).
 * Set `VITE_API_BASE_URL` when the static site and API are on different origins (e.g. Azure).
 */
export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_BASE_URL?.toString().trim() ?? 'https://amazin-bookstore-huaxa2cnapcne2fa.eastus-01.azurewebsites.net'
  if (!base) {
    return path.startsWith('/') ? path : `/${path}`
  }
  const normalizedBase = base.replace(/\/$/, '')
  return path.startsWith('/')
    ? `${normalizedBase}${path}`
    : `${normalizedBase}/${path}`
}
