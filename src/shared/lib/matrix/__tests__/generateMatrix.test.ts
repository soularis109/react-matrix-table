import { describe, expect, it } from 'vitest'
import { generateMatrix } from '../generateMatrix'

describe('generateMatrix', () => {
  it('creates matrix with given dimensions', () => {
    const rows = 3
    const cols = 4

    const matrix = generateMatrix(rows, cols)

    expect(matrix).toHaveLength(rows)
    matrix.forEach((row) => {
      expect(row).toHaveLength(cols)
    })
  })

  it('assigns unique ids across the whole matrix', () => {
    const matrix = generateMatrix(4, 5)

    const ids = matrix.flat().map((cell) => cell.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(ids.length)
  })

  it('generates three-digit amounts between 100 and 999', () => {
    const matrix = generateMatrix(5, 5)

    matrix.flat().forEach((cell) => {
      expect(cell.amount).toBeGreaterThanOrEqual(100)
      expect(cell.amount).toBeLessThanOrEqual(999)
    })
  })

  it('respects custom startId', () => {
    const startId = 10
    const matrix = generateMatrix(1, 3, startId)
    const ids = matrix[0].map((cell) => cell.id)

    expect(ids).toEqual([10, 11, 12])
  })
})
