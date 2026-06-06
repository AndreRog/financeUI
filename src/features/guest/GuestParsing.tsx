import { Icon } from '@/components/Icon'
import { GuestSecurityNote } from './GuestSecurityNote'

export function GuestParsing({ fileName }: { fileName: string }) {
  return (
    <div className="gl-wrap narrow gl-center">
      <div className="gl-eyebrow">Reading your statement</div>
      <h1 className="gl-hero-title">One moment</h1>
      <div className="gl-parse">
        <span className="gl-parse-file">
          <Icon name="file-text" size={16} />
          {fileName}
        </span>
        <div className="gl-parse-title">Building your review…</div>
        <div className="gl-steps">
          <div className="gl-step active">
            <span className="gl-step-dot">
              <span className="gl-spin" />
            </span>
            Reading transactions
          </div>
          <div className="gl-step todo">
            <span className="gl-step-dot" />
            Sorting into categories
          </div>
        </div>
        <div className="gl-bar-track">
          <div className="gl-bar-fill" style={{ width: '62%' }} />
        </div>
      </div>
      <GuestSecurityNote />
    </div>
  )
}
