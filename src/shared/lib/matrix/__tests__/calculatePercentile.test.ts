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

  it('calculates 60th percentile using linear interpolation', () => {
    const values = [1, 2]
    expect(calculatePercentile(values, 60)).toBe(1.6)
  })

  it('calculates 60th percentile for larger arrays', () => {
    const values = [1, 2, 3, 4, 5]
    expect(calculatePercentile(values, 60)).toBe(3.4)
  })

  it('works with unsorted data', () => {
    const values = [10, 5, 30, 20]
    expect(calculatePercentile(values, 60)).toBe(18)
  })

  it('returns smallest value for 0th percentile', () => {
    const values = [10, 5, 30, 20]
    expect(calculatePercentile(values, 0)).toBe(5)
  })

  it('returns largest value for 100th percentile', () => {
    const values = [10, 5, 30, 20]
    expect(calculatePercentile(values, 100)).toBe(30)
  })
})
