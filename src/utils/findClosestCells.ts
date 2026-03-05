import type { Cell, Matrix } from '../types/matrix'

export function findClosestCells(matrix: Matrix, targetCell: Cell, count: number): number[] {
  if (count <= 0) return []

  const allCells: Cell[] = matrix.flat().filter((cell) => cell.id !== targetCell.id)

  const sortedByDiff = allCells
    .map((cell) => ({
      cell,
      diff: Math.abs(cell.amount - targetCell.amount),
    }))
    .sort((a, b) => {
      if (a.diff === b.diff) {
        return a.cell.id - b.cell.id
      }
      return a.diff - b.diff
    })

  return sortedByDiff.slice(0, count).map((item) => item.cell.id)
}

