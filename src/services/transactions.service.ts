import { API_URL } from './client'

/**
 * Carried over from the old app as the service pattern (typed DTOs + fetch
 * wrappers). These endpoints target the OLD single-user backend and will be
 * rewritten against the new multi-user backend as issues 0004–0013 land.
 */

export interface Transaction {
  id: string
  category: string
  bankName: string
  sub_category: string
  date: string
  description: string
  amount: number
  finalBalance: number
}

export interface AggregatedResult {
  period: string | null
  groupKey: string | null
  total: number
}

export interface SearchExpenses {
  next: { href: string }
  data: Transaction[] | AggregatedResult[]
}

export interface Category {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE' | 'EXCLUDED'
  subcategories: Category[]
}

export const getExpenses = async (
  from: string,
  to: string,
  dimensions: string[],
  cursor: string,
): Promise<SearchExpenses> => {
  try {
    const url = new URL(`${API_URL}/transactions`)
    const params = url.searchParams
    if (from?.trim()) params.append('from', from)
    if (to?.trim()) params.append('to', to)
    if (dimensions?.length) params.append('dimension', dimensions.join(','))
    if (cursor?.trim()) params.append('cursor', cursor)

    const response = await fetch(url)
    if (response.ok) {
      return (await response.json()) as SearchExpenses
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
  return { next: { href: '' }, data: [] }
}

export const updateTx = async (updatedTx: Transaction | undefined): Promise<void> => {
  if (!updatedTx) return
  const response = await fetch(`${API_URL}/transactions/${updatedTx.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: updatedTx.category }),
  })
  if (!response.ok) {
    throw new Error(`Error updating transaction ${updatedTx.id}`)
  }
}

/** Returns the assignable subcategory names (the backend sends a 2-level tree). */
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`)
    if (response.ok) {
      const categories = (await response.json()) as Category[]
      return categories.flatMap((c) => c.subcategories).map((s) => s.name)
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
  return []
}
