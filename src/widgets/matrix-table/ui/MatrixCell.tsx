import { memo } from 'react'
import type { Cell } from '@shared/types/matrix'
import { useMatrixUI, useMatrixActions } from '@shared/hooks/useMatrix'
import { calculateHeatmapPercent } from '@shared/lib/matrix/calculateHeatmap'

type MatrixCellProps = {
  cell: Cell
  rowIndex: number
  colIndex: number
  isPercentageMode: boolean
  rowSum: number
  rowMax: number
}

const CELL_STYLE: React.CSSProperties = { position: 'relative' }
const HEATMAP_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(129, 140, 248, 0.28)',
}

function MatrixCellInner({
  displayValue,
  heatmapWidth,
  isPercentageMode,
}: {
  displayValue: string | number
  heatmapWidth: number
  isPercentageMode: boolean
}) {
  return (
    <div style={CELL_STYLE}>
      {isPercentageMode && heatmapWidth > 0 && (
        <div style={{ ...HEATMAP_STYLE, width: `${heatmapWidth}%` }} />
      )}
      <span style={{ position: 'relative' }}>{displayValue}</span>
    </div>
  )
}

export const MatrixCell = memo(function MatrixCell({
  cell,
  rowIndex,
  colIndex,
  isPercentageMode,
  rowSum,
  rowMax,
}: MatrixCellProps) {
  const { highlightedCellIdsSet } = useMatrixUI()
  const { incrementCell, setHoveredCell, clearHoveredCell } = useMatrixActions()

  const isHighlighted = highlightedCellIdsSet.has(cell.id)

  let displayValue: string | number = cell.amount
  let heatmapWidth = 0

  if (isPercentageMode && rowSum > 0) {
    displayValue = `${Math.round((cell.amount / rowSum) * 100)}%`
    heatmapWidth = calculateHeatmapPercent(cell.amount, rowMax)
  }

  const commonProps = {
    'data-row': rowIndex,
    'data-col': colIndex,
    'data-highlighted': isHighlighted || undefined,
    onClick: () => incrementCell(rowIndex, colIndex),
    onMouseEnter: () => setHoveredCell(rowIndex, colIndex),
    onMouseLeave: () => clearHoveredCell(),
  }

  const inner = (
    <MatrixCellInner
      displayValue={displayValue}
      heatmapWidth={heatmapWidth}
      isPercentageMode={isPercentageMode}
    />
  )

  return <td {...commonProps}>{inner}</td>
})
