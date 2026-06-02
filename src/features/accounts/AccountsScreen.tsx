import { PagePlaceholder } from '@/components/PagePlaceholder'

/** Bank account management (issue 0006). */
export function AccountsScreen() {
  return (
    <PagePlaceholder
      title="Accounts"
      intent="Create, rename and remove bank accounts, and pick which bank each belongs to so the right CSV parser is used."
    />
  )
}
