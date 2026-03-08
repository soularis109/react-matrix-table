import { describe, expect, it } from 'vitest'
import { calculateRowMax } from '../calculateRowMax'

describe('calculateRowMax', () => {
  it('returns 0 for empty row', () => {
    expect(calculateRowMax([])).toBe(0)
  })

  it('returns single cell amount', () => {
    expect(calculateRowMax([{ id: 1, amount: 42 }])).toBe(42)
  })

  it('returns max amount from multiple cells', () => {
    const row = [
      { id: 1, amount: 10 },
      { id: 2, amount: 99 },
      { id: 3, amount: 50 },
    ]
    expect(calculateRowMax(row)).toBe(99)
  })

  it('returns correct max when all values equal', () => {
    const row = [
      { id: 1, amount: 100 },
      { id: 2, amount: 100 },
    ]
    expect(calculateRowMax(row)).toBe(100)
  })
})
