import { memo } from 'react'
import type { Cell } from '../../../entities/matrix'
import { useMatrix } from '../../../entities/matrix'
import { calculateHeatmapPercent } from '../../../entities/matrix'

type MatrixCellProps = {
  cell: Cell
  rowIndex: number
  colIndex: number
  isPercentageMode: boolean
  rowSum: number
  rowMax: number
  isFocused?: boolean
  /** When 'div', render as div for virtualized table body */
  as?: 'td' | 'div'
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
  isFocused = false,
  as = 'td',
}: MatrixCellProps) {
  const { state, incrementCell, setHoveredCell, clearHoveredCell } = useMatrix()
  const highlightedCellIds = state.highlightedCellIds ?? []
  const isHighlighted = highlightedCellIds.includes(cell.id)

  let displayValue: string | number = cell.amount
  let heatmapWidth = 0

  if (isPercentageMode && rowSum > 0) {
    const percentage = Math.round((cell.amount / rowSum) * 100)
    displayValue = `${percentage}%`
    heatmapWidth = calculateHeatmapPercent(cell.amount, rowMax)
  }

  const commonProps = {
    'data-row': rowIndex,
    'data-col': colIndex,
    'data-highlighted': isHighlighted || undefined,
    'data-focused': isFocused || undefined,
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

  if (as === 'div') {
    return (
      <div role="gridcell" {...commonProps}>
        {inner}
      </div>
    )
  }
  return <td {...commonProps}>{inner}</td>
})

