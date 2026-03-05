export function calculatePercentile(values: number[], percentile: number): number | null {
  if (values.length === 0) return null

  const sorted = values.toSorted((a, b) => a - b)
  const rank = Math.ceil((percentile / 100) * sorted.length)
  const index = Math.min(Math.max(rank - 1, 0), sorted.length - 1)

  return sorted[index]
}

