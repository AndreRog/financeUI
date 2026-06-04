import { PagePlaceholder } from '@/components/PagePlaceholder'

/** Transactions list + reassign subcategory + CSV import (issues 0009, 0010). */
export function TransactionsScreen() {
  return (
    <PagePlaceholder
      title="Transactions"
      intent="Browse imported transactions, fix a transaction's subcategory, and import a bank export into a chosen bank account."
    />
  )
}
