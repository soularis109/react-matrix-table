import { describe, expect, it } from 'vitest'
import type { Cell } from '../../types/matrix'
import { calculateRowSum } from '../calculateRowSum'

describe('calculateRowSum', () => {
  it('returns 0 for empty row', () => {
    expect(calculateRowSum([])).toBe(0)
  })

  it('sums all cell amounts in a row', () => {
    const row: Cell[] = [
      { id: 1, amount: 10 },
      { id: 2, amount: 20 },
      { id: 3, amount: 5 },
    ]

    expect(calculateRowSum(row)).toBe(35)
  })
})

