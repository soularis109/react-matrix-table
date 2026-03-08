import type { Cell, Matrix } from '../../types/matrix'

export function generateMatrix(rows: number, cols: number, startId = 1): Matrix {
  const matrix: Matrix = []
  let currentId = startId

  for (let r = 0; r < rows; r += 1) {
    const row: Cell[] = []
    for (let c = 0; c < cols; c += 1) {
      const amount = Math.floor(Math.random() * 900) + 100
      row.push({ id: currentId, amount })
      currentId += 1
    }
    matrix.push(row)
  }

  return matrix
}
