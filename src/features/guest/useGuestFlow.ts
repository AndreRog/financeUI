import { useState } from 'react'
import {
  useGuestImport,
  UnsupportedBankError,
  type GuestReview,
  type GuestMonthlyReview,
} from '@/services/guest.service'

export type Phase = 'landing' | 'parsing' | 'review' | 'error'

export interface GuestFlowHandle {
  phase: Phase
  fileName: string
  review: GuestReview | null
  currentMonth: GuestMonthlyReview | null
  selectedPeriod: string
  errorIsUnsupported: boolean
  start(file: File): void
  selectPeriod(period: string): void
  reset(): void
}

export function useGuestFlow(): GuestFlowHandle {
  const [phase, setPhase] = useState<Phase>('landing')
  const [fileName, setFileName] = useState('')
  const [review, setReview] = useState<GuestReview | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [errorIsUnsupported, setErrorIsUnsupported] = useState(false)
  const guestImport = useGuestImport()

  const currentMonth =
    review?.months.find((m) => m.period === selectedPeriod) ?? review?.months[0] ?? null

  function start(file: File) {
    setFileName(file.name)
    setPhase('parsing')
    guestImport.mutate(file, {
      onSuccess: (data) => {
        setReview(data)
        setSelectedPeriod(data.months[0]?.period ?? '')
        setPhase('review')
      },
      onError: (err) => {
        setErrorIsUnsupported(err instanceof UnsupportedBankError)
        setPhase('error')
      },
    })
  }

  function selectPeriod(period: string) {
    setSelectedPeriod(period)
  }

  function reset() {
    setPhase('landing')
    setFileName('')
    setReview(null)
    setSelectedPeriod('')
    setErrorIsUnsupported(false)
    guestImport.reset()
  }

  return { phase, fileName, review, currentMonth, selectedPeriod, errorIsUnsupported, start, selectPeriod, reset }
}
