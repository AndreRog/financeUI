import { Link, Route, Routes } from 'react-router'
import { AppShell } from './AppShell'
import { AuthBoundary } from './AuthBoundary'
import { GuestScreen } from '@/features/guest/GuestScreen'
import { LoginScreen } from '@/features/auth/LoginScreen'
import { RegisterScreen } from '@/features/auth/RegisterScreen'
import { DashboardScreen } from '@/features/dashboard/DashboardScreen'
import { TrendScreen } from '@/features/trend/TrendScreen'
import { ComparisonScreen } from '@/features/comparison/ComparisonScreen'
import { TransactionsScreen } from '@/features/transactions/TransactionsScreen'
import { AccountsScreen } from '@/features/accounts/AccountsScreen'
import { CategoriesScreen } from '@/features/categories/CategoriesScreen'
import { StyleguideScreen } from '@/features/styleguide/StyleguideScreen'

/** Protected layout: auth gate + app chrome, with screens in the Outlet. */
function ProtectedLayout() {
  return (
    <AuthBoundary>
      <AppShell />
    </AuthBoundary>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="mm-h1">Page not found</h1>
      <p className="mm-body text-secondary mt-2">
        That page doesn&apos;t exist.{' '}
        <Link to="/" className="text-primary">
          Go to the dashboard
        </Link>
        .
      </p>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public — render outside the shell, usable before auth lands. */}
      <Route path="/guest" element={<GuestScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      {/* Protected — inside AuthBoundary + AppShell. */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/trend" element={<TrendScreen />} />
        <Route path="/compare" element={<ComparisonScreen />} />
        <Route path="/transactions" element={<TransactionsScreen />} />
        <Route path="/accounts" element={<AccountsScreen />} />
        <Route path="/categories" element={<CategoriesScreen />} />
      </Route>

      {/* Dev-only styleguide. */}
      {import.meta.env.DEV && <Route path="/styleguide" element={<StyleguideScreen />} />}

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
