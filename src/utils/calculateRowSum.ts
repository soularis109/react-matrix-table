import type { Cell } from '../types/matrix'

export function calculateRowSum(row: Cell[]): number {
  return row.reduce((sum, cell) => sum + cell.amount, 0)
}

