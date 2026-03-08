/**
 * Calculates percentile using linear interpolation (Excel PERCENTILE.INC method).
 * position = (n - 1) * p/100 + 1; interpolate between sorted[lower] and sorted[upper].
 */
export function calculatePercentile(values: number[], percentile: number): number | null {
  if (values.length === 0) return null

  const sorted = values.toSorted((a, b) => a - b)
  const n = sorted.length

  if (n === 1) return sorted[0]

  const position = ((n - 1) * percentile) / 100 + 1
  const lowerIdx = Math.max(0, Math.floor(position) - 1)
  const upperIdx = Math.min(lowerIdx + 1, n - 1)
  const weight = position - Math.floor(position)

  return sorted[lowerIdx] + weight * (sorted[upperIdx] - sorted[lowerIdx])
}
