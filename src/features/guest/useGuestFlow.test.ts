import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGuestFlow } from './useGuestFlow'
import type { GuestReview } from '@/services/guest.service'

const mockMutate = vi.hoisted(() => vi.fn())
const mockReset = vi.hoisted(() => vi.fn())

vi.mock('@/services/guest.service', () => {
  class UnsupportedBankError extends Error {
    constructor(message = 'This bank is not supported yet') {
      super(message)
      this.name = 'UnsupportedBankError'
    }
  }
  return {
    useGuestImport: () => ({ mutate: mockMutate, reset: mockReset }),
    UnsupportedBankError,
  }
})

// Re-import after mock so we get the mocked class for instanceof checks
const { UnsupportedBankError } = await import('@/services/guest.service')

const MONTH_A = {
  period: '2026-05',
  income: 2000,
  expense: 800,
  savings: 1200,
  categories: [],
  transactionCount: 20,
  excludedCount: 0,
}
const MONTH_B = {
  period: '2026-04',
  income: 1800,
  expense: 700,
  savings: 1100,
  categories: [],
  transactionCount: 17,
  excludedCount: 1,
}
const MOCK_REVIEW: GuestReview = { detectedBank: 'CAIXAGERALDEPOSITOS', months: [MONTH_A, MONTH_B] }

function simulateSuccess(review: GuestReview = MOCK_REVIEW) {
  const calls = mockMutate.mock.calls
  const [, callbacks] = calls[calls.length - 1]
  act(() => callbacks.onSuccess(review))
}

function simulateError(err: Error) {
  const calls = mockMutate.mock.calls
  const [, callbacks] = calls[calls.length - 1]
  act(() => callbacks.onError(err))
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useGuestFlow — initial state', () => {
  it('starts on the landing phase with empty state', () => {
    const { result } = renderHook(() => useGuestFlow())
    expect(result.current.phase).toBe('landing')
    expect(result.current.fileName).toBe('')
    expect(result.current.review).toBeNull()
    expect(result.current.currentMonth).toBeNull()
    expect(result.current.selectedPeriod).toBe('')
    expect(result.current.errorIsUnsupported).toBe(false)
  })
})

describe('start(file)', () => {
  it('sets fileName and moves to parsing', () => {
    const { result } = renderHook(() => useGuestFlow())
    const file = new File(['data'], 'extrato.csv')

    act(() => result.current.start(file))

    expect(result.current.phase).toBe('parsing')
    expect(result.current.fileName).toBe('extrato.csv')
    expect(mockMutate).toHaveBeenCalledOnce()
  })

  it('moves to review on success, seeds selectedPeriod from first month', () => {
    const { result } = renderHook(() => useGuestFlow())

    act(() => result.current.start(new File([''], 'f.csv')))
    simulateSuccess()

    expect(result.current.phase).toBe('review')
    expect(result.current.review).toEqual(MOCK_REVIEW)
    expect(result.current.selectedPeriod).toBe('2026-05')
  })

  it('currentMonth matches the seeded selectedPeriod after success', () => {
    const { result } = renderHook(() => useGuestFlow())

    act(() => result.current.start(new File([''], 'f.csv')))
    simulateSuccess()

    expect(result.current.currentMonth).toEqual(MONTH_A)
  })

  it('moves to error with errorIsUnsupported=true when UnsupportedBankError is thrown', () => {
    const { result } = renderHook(() => useGuestFlow())

    act(() => result.current.start(new File([''], 'f.csv')))
    simulateError(new UnsupportedBankError())

    expect(result.current.phase).toBe('error')
    expect(result.current.errorIsUnsupported).toBe(true)
  })

  it('moves to error with errorIsUnsupported=false for a generic error', () => {
    const { result } = renderHook(() => useGuestFlow())

    act(() => result.current.start(new File([''], 'f.csv')))
    simulateError(new Error('network failure'))

    expect(result.current.phase).toBe('error')
    expect(result.current.errorIsUnsupported).toBe(false)
  })
})

describe('selectPeriod(p)', () => {
  it('updates currentMonth to the matching month', () => {
    const { result } = renderHook(() => useGuestFlow())

    act(() => result.current.start(new File([''], 'f.csv')))
    simulateSuccess()

    act(() => result.current.selectPeriod('2026-04'))

    expect(result.current.selectedPeriod).toBe('2026-04')
    expect(result.current.currentMonth).toEqual(MONTH_B)
  })
})

describe('reset()', () => {
  it('returns to landing and clears all state', () => {
    const { result } = renderHook(() => useGuestFlow())

    act(() => result.current.start(new File([''], 'f.csv')))
    simulateSuccess()
    act(() => result.current.reset())

    expect(result.current.phase).toBe('landing')
    expect(result.current.fileName).toBe('')
    expect(result.current.review).toBeNull()
    expect(result.current.selectedPeriod).toBe('')
    expect(result.current.errorIsUnsupported).toBe(false)
  })

  it('calls mutation.reset()', () => {
    const { result } = renderHook(() => useGuestFlow())

    act(() => result.current.reset())

    expect(mockReset).toHaveBeenCalledOnce()
  })
})
