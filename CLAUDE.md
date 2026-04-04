# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FinanceSPA is a React-based single-page application for managing personal finance transactions. The application uses Vite as the build tool, Material-UI for the component library, and integrates with a backend API for transaction management. Authentication is implemented via Keycloak (currently commented out in main.tsx).

## Development Commands

### Running the Application
```bash
npm run dev
```
Starts the development server at http://127.0.0.1:3000

### Building
```bash
npm run build
```
Compiles TypeScript and builds the application for production

### Linting
```bash
npm run lint
```
Runs ESLint with TypeScript rules

### Preview Production Build
```bash
npm run preview
```

## Architecture

### Directory Structure

```
src/
├── assets/theme/          # MUI theme configuration and theme provider
├── auth/                  # Authentication context and Keycloak integration
├── components/            # Reusable UI components (charts, tables, buttons)
├── error/                 # Error boundary components
├── pages/                 # Page-level components (routes)
├── screens/               # Screen components used by pages
│   └── home/
├── services/              # API service layer for backend communication
└── main.tsx               # Application entry point
```

### Key Architectural Patterns

**Theme Management**: The app uses a custom theme context (`ThemeProviderContext`) that wraps Material-UI's ThemeProvider. Access the theme toggle with `useThemeMode()` hook. The theme configuration is in `src/assets/theme/theme.ts`.

**Authentication**: Keycloak integration is set up via `KeycloakAuthenticationBoundary` and `AuthContext`. The boundary is currently commented out in `main.tsx` but ready to be enabled. The authentication state is managed through React Context and can be accessed via `useAuthentication()` hook.

**Data Fetching**: Uses TanStack Query (React Query) for server state management. The QueryClient is instantiated at the page level (see `src/pages/home.tsx`). API services are in `src/services/transactions.service.ts`.

**Routing**: Uses React Router v7 with routes defined in `main.tsx`. Current route structure:
- `/` → HomePage → Expenses screen

### API Integration

The backend API URL is configured via environment variable `VITE_API_URL` in `.env` (default: http://localhost:9000).

**Key API Service Functions** (src/services/transactions.service.ts):
- `getExpenses(from, to, dimensions, cursor)` - Fetch transactions with cursor-based pagination
- `updateTx(transaction)` - Update transaction category
- `getCategories()` - Fetch available categories
- `getBankTypes()` - Fetch supported bank types (currently returns empty array)

All services use the native `fetch` API and return promises.

### Component Organization

**Pages vs Screens**: Pages (in `src/pages/`) are route-level components that set up data providers (like QueryClient). Screens (in `src/screens/`) contain the actual UI implementation.

**Charts**: Multiple chart implementations available:
- `LineChart.tsx` - Line chart component
- `LineStackBarChart.tsx` - Stacked bar chart with line overlay
- Uses both Chart.js (react-chartjs-2) and MUI X-Charts (@mui/x-charts)

**TransactionsTable**: Main table component for displaying and editing transactions. Supports inline category updates.

### TypeScript Configuration

Strict mode is enabled with these key settings:
- Target: ES2020
- Module resolution: bundler (Vite-specific)
- JSX: react-jsx (new JSX transform)
- Strict linting enabled (noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch)

### Environment Variables

Required environment variables in `.env`:
- `VITE_API_URL` - Backend API base URL
- `VITE_PUBLIC_CLIENT_ID` - Keycloak client ID (when auth is enabled)

## Keycloak Authentication

When enabling Keycloak authentication:
1. Uncomment `<KeycloakAuthenticationBoundary>` wrapper in `src/main.tsx`
2. Configure Keycloak settings in `src/auth/KeycloakAuthenticationBoundary.tsx` (currently hardcoded to localhost:8080)
3. Ensure `VITE_PUBLIC_CLIENT_ID` is set in `.env`

The authentication flow uses `useKeycloak()` hook which manages the Keycloak instance lifecycle.

## State Management

- **Theme**: React Context via `ThemeProviderContext`
- **Authentication**: React Context via `AuthenticationContext`
- **Server State**: TanStack Query (React Query)
- **Local Component State**: React useState hooks

## Styling

The application uses a combination of:
- Material-UI components with custom theming
- Tailwind CSS (configured but minimal usage)
- Emotion for styled components (Material-UI dependency)
