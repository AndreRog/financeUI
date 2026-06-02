import { Link } from 'react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Button } from '@/components/Button'

/** Public sign-in (Google SSO or email/password). Wired with issue 0005. */
export function LoginScreen() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <PagePlaceholder title="Sign in" intent="Continue with Google, or sign in with email and password.">
        <div className="flex flex-col gap-2">
          <Button block>Continue with Google</Button>
          <Button block variant="secondary">
            Sign in with email
          </Button>
          <p className="mm-sm text-secondary">
            New here?{' '}
            <Link to="/register" className="text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </PagePlaceholder>
    </div>
  )
}
