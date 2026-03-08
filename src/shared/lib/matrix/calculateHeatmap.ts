export function calculateHeatmapPercent(value: number, max: number): number {
  if (max <= 0) return 0
  if (value <= 0) return 0

  const percent = (value / max) * 100
  return Math.max(0, Math.min(100, Math.round(percent)))
}
