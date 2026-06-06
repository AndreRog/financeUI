import { Icon } from '@/components/Icon'

export function GuestSecurityNote() {
  return (
    <div className="gl-secure">
      <Icon name="lock" size={15} />
      <span>Processed securely and never saved.</span>
    </div>
  )
}
