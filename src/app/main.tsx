import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { ThemeModeProvider } from '@/theme/ThemeModeProvider'
import { AppRouter } from './router'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

// Provider order: theme (data-theme on <html>) → server state → routing.
// The auth boundary lives inside the router so public routes work pre-Keycloak.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeModeProvider>
  </React.StrictMode>,
)
