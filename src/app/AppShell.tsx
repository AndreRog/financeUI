import { NavLink, Outlet } from 'react-router'
import { Moon, Sun, LogOut } from 'lucide-react'
import { Icon, type IconName } from '@/components/Icon'
import { useThemeMode } from '@/theme/ThemeModeProvider'
import { cn } from '@/lib/cn'

interface NavItem {
  to: string
  label: string
  icon: IconName
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'home' },
  { to: '/trend', label: 'Trend', icon: 'trending-up' },
  { to: '/compare', label: 'Comparison', icon: 'pie' },
  { to: '/transactions', label: 'Transactions', icon: 'list' },
  { to: '/accounts', label: 'Accounts', icon: 'card' },
  { to: '/categories', label: 'Categories', icon: 'filter' },
]

function ThemeToggle() {
  const { mode, toggle } = useThemeMode()
  return (
    <button
      className="mm-btn mm-btn-ghost mm-btn-sm"
      onClick={toggle}
      aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

/**
 * Responsive app chrome for protected screens. Sidebar nav on wide viewports,
 * a top bar that collapses to a horizontal scroll on narrow ones. Public pages
 * (guest, login, register) render outside this shell.
 */
export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1080px] flex-col px-4 md:flex-row md:gap-6 md:px-6">
        {/* Sidebar / top nav */}
        <header className="flex shrink-0 flex-col gap-4 py-4 md:w-56 md:py-8">
          <NavLink to="/" className="flex items-center gap-2 px-2">
            <img src="/logo-mark.svg" alt="" width={28} height={28} />
            <span className="mm-h3">MoneyMind</span>
          </NavLink>

          <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-soft text-primary-soft-text'
                      : 'text-secondary hover:bg-surface-2',
                  )
                }
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto hidden items-center justify-between px-2 md:flex">
            <ThemeToggle />
            {/* Logout slot — wired when auth lands (issue 0005). */}
            <button className="mm-btn mm-btn-ghost mm-btn-sm" aria-label="Log out" disabled>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 py-4 md:py-8">
          <div className="mb-4 flex justify-end md:hidden">
            <ThemeToggle />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
