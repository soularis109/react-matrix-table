import { describe, expect, it } from 'vitest'
import type { Cell, Matrix } from '../../../types/matrix'
import { findClosestCells } from '../findClosestCells'

const makeMatrix = (rows: number, cols: number, values: number[][]): Matrix => {
  const matrix: Matrix = []
  let id = 1

  for (let r = 0; r < rows; r += 1) {
    const row: Cell[] = []
    for (let c = 0; c < cols; c += 1) {
      row.push({ id, amount: values[r][c] })
      id += 1
    }
    matrix.push(row)
  }

  return matrix
}

describe('findClosestCells', () => {
  it('returns empty array when count is zero or negative', () => {
    const matrix = makeMatrix(1, 1, [[10]])
    const target = matrix[0][0]

    expect(findClosestCells(matrix, target, 0)).toEqual([])
    expect(findClosestCells(matrix, target, -1)).toEqual([])
  })

  it('finds ids of closest cells by amount', () => {
    const matrix = makeMatrix(
      2,
      3,
      [
        [10, 20, 30],
        [40, 50, 60],
      ],
    )
    const target = matrix[0][1]

    const result = findClosestCells(matrix, target, 2)

    expect(result).toEqual([1, 3])
  })

  it('returns all available ids when count exceeds neighbors', () => {
    const matrix = makeMatrix(
      1,
      3,
      [
        [10, 20, 30],
      ],
    )
    const target = matrix[0][1]

    const result = findClosestCells(matrix, target, 10)

    expect(result).toEqual([1, 3])
  })

  it('handles zero and negative amounts', () => {
    const matrix = makeMatrix(
      1,
      4,
      [
        [-10, 0, 5, -5],
      ],
    )
    const target = matrix[0][1]

    const result = findClosestCells(matrix, target, 3)

    expect(result).toEqual([3, 4, 1])
  })

  it('breaks ties by cell id for deterministic ordering', () => {
    const matrix = makeMatrix(
      1,
      4,
      [
        [10, 11, 9, 8],
      ],
    )
    const target = matrix[0][0]

    const result = findClosestCells(matrix, target, 3)

    expect(result).toEqual([2, 3, 4])
  })
})
