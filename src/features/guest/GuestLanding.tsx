import { useRef, useState, type DragEvent } from 'react'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import { GuestSecurityNote } from './GuestSecurityNote'
import { GuestSupportedBanks } from './GuestSupportedBanks'

function Dropzone({ onFile }: { onFile: (file: File) => void }) {
  const [hot, setHot] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setHot(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  async function useSample() {
    const res = await fetch('/sample-statement.csv')
    const blob = await res.blob()
    onFile(new File([blob], 'extrato-cgd-exemplo.csv', { type: 'text/csv' }))
  }

  return (
    <div
      className={'gl-drop' + (hot ? ' hot' : '')}
      onDragOver={(e) => {
        e.preventDefault()
        setHot(true)
      }}
      onDragLeave={() => setHot(false)}
      onDrop={onDrop}
    >
      <span className="gl-drop-ico">
        <Icon name="upload" size={26} />
      </span>
      <div className="gl-drop-title">Drop your bank statement here</div>
      <div className="gl-drop-hint">CSV exported from your bank · up to 12 months</div>
      <div className="gl-drop-actions">
        <Button icon="file-text" onClick={() => inputRef.current?.click()}>
          Choose a CSV file
        </Button>
        <span className="gl-or">or</span>
        <Button variant="ghost" icon="sparkle" onClick={useSample}>
          Use a sample file
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function GuestLanding({ onFile }: { onFile: (file: File) => void }) {
  return (
    <div className="gl-wrap narrow gl-center">
      <div className="gl-eyebrow">No signup · free</div>
      <h1 className="gl-hero-title">See where your money goes</h1>
      <p className="gl-hero-sub">
        Upload a bank statement and get a clear monthly review in seconds. No account, no waiting.
      </p>
      <Dropzone onFile={onFile} />
      <GuestSecurityNote />
      <GuestSupportedBanks />
    </div>
  )
}
