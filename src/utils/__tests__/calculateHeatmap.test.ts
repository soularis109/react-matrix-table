import { describe, expect, it } from 'vitest'
import { calculateHeatmapPercent } from '../calculateHeatmap'

describe('calculateHeatmapPercent', () => {
  it('returns 0 when max is non-positive', () => {
    expect(calculateHeatmapPercent(10, 0)).toBe(0)
    expect(calculateHeatmapPercent(10, -5)).toBe(0)
  })

  it('returns 0 when value is non-positive', () => {
    expect(calculateHeatmapPercent(0, 10)).toBe(0)
    expect(calculateHeatmapPercent(-5, 10)).toBe(0)
  })

  it('returns 100 when value equals max', () => {
    expect(calculateHeatmapPercent(10, 10)).toBe(100)
  })

  it('returns rounded percent of value relative to max, clamped between 0 and 100', () => {
    expect(calculateHeatmapPercent(5, 10)).toBe(50)
    expect(calculateHeatmapPercent(3, 7)).toBe(Math.round((3 / 7) * 100))
    expect(calculateHeatmapPercent(200, 100)).toBe(100)
  })
})

