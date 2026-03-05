import type { Cell, Matrix } from '../types/matrix'

export function findClosestCells(matrix: Matrix, targetCell: Cell, count: number): number[] {
  if (count <= 0) return []

  const allCells: Cell[] = matrix.flat().filter((cell) => cell.id !== targetCell.id)

  const sortedByDiff = allCells.toSorted((a, b) => {
    const diffA = Math.abs(a.amount - targetCell.amount)
    const diffB = Math.abs(b.amount - targetCell.amount)

    if (diffA === diffB) {
      return a.id - b.id
    }

    return diffA - diffB
  })

  return sortedByDiff.slice(0, count).map((cell) => cell.id)
}

