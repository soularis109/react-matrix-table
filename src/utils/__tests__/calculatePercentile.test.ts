import { describe, expect, it } from 'vitest'
import { calculatePercentile } from '../calculatePercentile'

describe('calculatePercentile', () => {
  it('returns null for empty array', () => {
    expect(calculatePercentile([], 60)).toBeNull()
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
})

