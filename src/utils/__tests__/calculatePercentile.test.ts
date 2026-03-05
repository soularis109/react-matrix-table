import { describe, expect, it } from 'vitest'
import { calculatePercentile } from '../calculatePercentile'

describe('calculatePercentile', () => {
  it('returns null for empty array', () => {
    expect(calculatePercentile([], 60)).toBeNull()
  })

  it('does not mutate original array', () => {
    const values = [5, 3, 1, 4, 2]
    const original = [...values]

    calculatePercentile(values, 60)

    expect(values).toEqual(original)
  })

  it('calculates 60th percentile using nearest-rank method', () => {
    const values = [1, 2, 3, 4, 5]
    // sorted = [1,2,3,4,5]
    // rank = ceil(0.6 * 5) = 3 -> index 2 -> value 3
    expect(calculatePercentile(values, 60)).toBe(3)
  })

  it('works with unsorted data', () => {
    const values = [10, 5, 30, 20]
    // sorted = [5,10,20,30]
    // rank = ceil(0.6 * 4) = 3 -> index 2 -> value 20
    expect(calculatePercentile(values, 60)).toBe(20)
  })

  it('returns smallest value for 0th percentile', () => {
    const values = [10, 5, 30, 20]
    // sorted = [5,10,20,30] -> rank = ceil(0 * 4) = 0 -> index 0 after clamping
    expect(calculatePercentile(values, 0)).toBe(5)
  })

  it('returns largest value for 100th percentile', () => {
    const values = [10, 5, 30, 20]
    // sorted = [5,10,20,30] -> rank = ceil(1 * 4) = 4 -> index 3
    expect(calculatePercentile(values, 100)).toBe(30)
  })
})

