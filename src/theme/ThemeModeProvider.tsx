import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'light' | 'dark'

interface ThemeModeContextValue {
  mode: ThemeMode
  toggle: () => void
  setMode: (mode: ThemeMode) => void
}

const STORAGE_KEY = 'mm-theme'
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

function readInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Owns the single source of theme truth: `data-theme` on <html>. No MUI, no
 * component re-theme — the CSS-variable tokens do the work, so a switch is just
 * a data-attribute flip with the gentle 0.3s transition defined in globals.css.
 */
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readInitialMode)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => setModeState(next), [])
  const toggle = useCallback(
    () => setModeState((m) => (m === 'light' ? 'dark' : 'light')),
    [],
  )

  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle, setMode])
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is co-located with its provider by convention
export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used within a ThemeModeProvider')
  return ctx
}
