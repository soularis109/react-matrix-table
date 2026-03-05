import type { Cell } from '../types/matrix'
import { useMatrix } from '../hooks/useMatrix'
import { calculateHeatmapPercent } from '../utils/calculateHeatmap'

type MatrixCellProps = {
  cell: Cell
  rowIndex: number
  colIndex: number
  isPercentageMode: boolean
  rowSum: number
  rowMax: number
}

export function MatrixCell({
  cell,
  rowIndex,
  colIndex,
  isPercentageMode,
  rowSum,
  rowMax,
}: MatrixCellProps) {
  const {
    state: { highlightedCellIds },
  } = useMatrix()

  const isHighlighted = highlightedCellIds.includes(cell.id)

  let displayValue: string | number = cell.amount
  let heatmapWidth = 0

  if (isPercentageMode && rowSum > 0) {
    const percentage = Math.round((cell.amount / rowSum) * 100)
    displayValue = `${percentage}%`
    heatmapWidth = calculateHeatmapPercent(cell.amount, rowMax)
  }

  return (
    <td data-row={rowIndex} data-col={colIndex} data-highlighted={isHighlighted || undefined}>
      <div style={{ position: 'relative' }}>
        {isPercentageMode && heatmapWidth > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${heatmapWidth}%`,
              backgroundColor: 'rgba(0, 123, 255, 0.3)',
            }}
          />
        )}
        <span style={{ position: 'relative' }}>{displayValue}</span>
      </div>
    </td>
  )
}

