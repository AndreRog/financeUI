import { Link } from 'react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Button } from '@/components/Button'

/**
 * Public guest landing + review. Stateless CSV import (nothing persisted) that
 * shows a monthly review as an appetiser, then prompts to create an account.
 * Renders outside the AppShell.
 */
export function GuestScreen() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-12">
      <PagePlaceholder
        title="See where your money goes"
        intent="Upload a bank export and get an instant monthly review — no sign-up, nothing saved. Like it? Create an account to keep your data."
      >
        <div className="flex gap-2">
          <Button>Upload a CSV</Button>
          <Link to="/register">
            <Button variant="secondary">Create an account</Button>
          </Link>
        </div>
      </PagePlaceholder>
    </div>
  )
}
