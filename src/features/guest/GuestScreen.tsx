import { useGuestFlow } from './useGuestFlow'
import { GuestTopBar } from './GuestTopBar'
import { GuestFooter } from './GuestFooter'
import { GuestLanding } from './GuestLanding'
import { GuestParsing } from './GuestParsing'
import { GuestReviewScreen } from './GuestReview'
import { GuestError } from './GuestError'

export function GuestScreen() {
  const { phase, fileName, review, currentMonth, selectedPeriod, errorIsUnsupported, start, selectPeriod, reset } =
    useGuestFlow()

  return (
    <div className="gl-page">
      <GuestTopBar />
      <main className="gl-main">
        {phase === 'landing' && <GuestLanding onFile={start} />}
        {phase === 'parsing' && <GuestParsing fileName={fileName} />}
        {phase === 'review' && review && currentMonth && (
          <GuestReviewScreen
            review={review}
            month={currentMonth}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={selectPeriod}
            onStartOver={reset}
          />
        )}
        {phase === 'error' && (
          <GuestError fileName={fileName} unsupported={errorIsUnsupported} onStartOver={reset} />
        )}
      </main>
      {phase !== 'review' && <GuestFooter />}
    </div>
  )
}
