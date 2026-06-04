/**
 * Shared API client config. The base URL comes from VITE_API_URL (see .env).
 *
 * NOTE: the service functions in this folder target the OLD single-user
 * backend. They are kept as the established pattern (typed DTO + fetch wrapper
 * + TanStack Query hook) and are rewritten against the new multi-user backend
 * as issues 0004–0013 land (auth, bank accounts, categories, summary engine,
 * guest import). Until then, screens use the mock hooks (e.g. usePeriodSummary).
 */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9000'

/** Thin fetch wrapper: throws on non-2xx, parses JSON. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${path}`)
  }
  return (await res.json()) as T
}
