import { Link } from 'react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Button } from '@/components/Button'

/** Public registration (email/password or Google). Wired with issue 0005. */
export function RegisterScreen() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <PagePlaceholder title="Create your account" intent="Use your email and a password, or continue with Google.">
        <div className="flex flex-col gap-2">
          <Button block>Continue with Google</Button>
          <Button block variant="secondary">
            Sign up with email
          </Button>
          <p className="mm-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </PagePlaceholder>
    </div>
  )
}
