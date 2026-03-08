import type { Cell } from '../../types/matrix'

export function calculateRowMax(row: Cell[]): number {
  return row.reduce((max, cell) => (cell.amount > max ? cell.amount : max), 0)
}
