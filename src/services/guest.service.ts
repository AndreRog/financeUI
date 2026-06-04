import { useMutation } from '@tanstack/react-query'
import { API_URL } from './client'

/**
 * Guest import — the public, stateless flow (backend issue 0004). A visitor
 * uploads a bank CSV; the backend parses it in memory, auto-detects the bank,
 * classifies each transaction into a System Subcategory and runs the Summary
 * engine. Nothing is persisted. The response shape mirrors the backend
 * `GuestReview` record verbatim.
 *
 * Domain rules encoded here (same as the reporting engine):
 *   • income / expense / savings are driven by Category Type, never amount sign
 *   • savings = income − expense
 *   • EXCLUDED transactions never appear in a total or in `categories`
 */

/** One expense Category's slice of a month: total spend + share (0–1) of expense. */
export interface GuestCategorySlice {
  name: string
  amount: number
  share: number
}

/** A single month's review. `period` is an ISO year-month, e.g. "2026-05". */
export interface GuestMonthlyReview {
  period: string
  income: number
  expense: number
  savings: number
  categories: GuestCategorySlice[]
  /** Counted transactions (EXCLUDED transfers are not counted here). */
  transactionCount: number
  /** How many EXCLUDED transfers were dropped from every total. */
  excludedCount: number
}

export interface GuestReview {
  /** Bank type key detected by the backend, e.g. "CAIXAGERALDEPOSITOS". */
  detectedBank: string
  /** One review per month present in the file, most recent first. */
  months: GuestMonthlyReview[]
}

/** Thrown when the backend could not read the file (no parser matched). */
export class UnsupportedBankError extends Error {
  constructor(message = 'This bank is not supported yet') {
    super(message)
    this.name = 'UnsupportedBankError'
  }
}

/** POSTs the file as multipart/form-data to the public guest endpoint. */
export async function importGuestFile(file: File): Promise<GuestReview> {
  const body = new FormData()
  body.append('file', file)

  const res = await fetch(`${API_URL}/guest/import`, { method: 'POST', body })

  if (res.status === 422) {
    throw new UnsupportedBankError()
  }
  if (!res.ok) {
    throw new Error(`Guest import failed (${res.status})`)
  }
  return (await res.json()) as GuestReview
}

/** Mutation hook wrapping the upload, so the UI gets pending/error/success states. */
export function useGuestImport() {
  return useMutation<GuestReview, Error, File>({
    mutationFn: importGuestFile,
  })
}
