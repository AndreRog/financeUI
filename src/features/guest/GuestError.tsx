import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import { GuestSupportedBanks } from './GuestSupportedBanks'

export interface GuestErrorProps {
  fileName: string
  unsupported: boolean
  onStartOver: () => void
}

export function GuestError({ fileName, unsupported, onStartOver }: GuestErrorProps) {
  return (
    <div className="gl-wrap narrow gl-center">
      <div className="gl-error">
        <span className="gl-error-ico">
          <Icon name="alert" size={26} />
        </span>
        <div className="gl-error-title">
          {unsupported ? "This bank isn't supported yet" : 'We could not read this file'}
        </div>
        <p className="gl-error-text">
          We couldn&apos;t read{' '}
          <span className="gl-error-bank">
            <Icon name="file-text" size={14} />
            {fileName || 'your file'}
          </span>
          . Today MoneyMind reads Caixa Geral de Depósitos and Santander — more are on the way.
        </p>
        <div className="gl-request">
          <input className="gl-input" type="email" placeholder="you@email.pt" />
          <Button icon="mail">Request it</Button>
        </div>
        <div className="gl-error-foot">
          We&apos;ll email you the moment more banks are ready. Your file was not saved.
        </div>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <Button variant="ghost" onClick={onStartOver}>
            Try another file
          </Button>
        </div>
      </div>
      <GuestSupportedBanks />
    </div>
  )
}
