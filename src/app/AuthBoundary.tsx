import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

/**
 * Auth gate for protected routes. Currently a pass-through: the new backend's
 * OIDC/Keycloak flow lands with issue 0005, at which point this resolves the
 * CurrentUser from the bearer token and redirects unauthenticated users to
 * /login. Flip DISABLE_AUTH to false (and wire a real `authenticated` signal)
 * to enable gating — public routes (/guest, /login, /register) never pass
 * through here, so the app is usable before auth exists.
 */
const DISABLE_AUTH = true

export function AuthBoundary({ children }: { children: ReactNode }) {
  // Placeholder until Keycloak is wired (issue 0005).
  const authenticated = DISABLE_AUTH

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
