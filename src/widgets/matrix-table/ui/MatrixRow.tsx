import { memo } from 'react'
import type { Cell } from '../../../entities/matrix'
import { useMatrix } from '../../../entities/matrix'
import { calculateRowSum } from '../../../entities/matrix'
import { MatrixCell } from './MatrixCell'
import { SumCell } from './SumCell'

const ROW_HEIGHT_PX = 40

type MatrixRowProps = {
  row: Cell[]
  rowIndex: number
  onRemove: () => void
  focusedRow: number
  focusedCol: number
  /** When true, render as div with grid for virtualized body */
  virtualized?: boolean
  gridTemplateColumns?: string
}

export const MatrixRow = memo(function MatrixRow({
  row,
  rowIndex,
  onRemove,
  focusedRow,
  focusedCol,
  virtualized = false,
  gridTemplateColumns,
}: MatrixRowProps) {
  const {
    state: { hoveredSumRowIndex },
  } = useMatrix()

  const rowSum = calculateRowSum(row)
  const rowMax = row.reduce((max, cell) => (cell.amount > max ? cell.amount : max), 0)
  const isPercentageMode = hoveredSumRowIndex === rowIndex

  const cells = row.map((cell, colIndex) => (
    <MatrixCell
      key={cell.id}
      cell={cell}
      rowIndex={rowIndex}
      colIndex={colIndex}
      isPercentageMode={isPercentageMode}
      rowSum={rowSum}
      rowMax={rowMax}
      isFocused={focusedRow === rowIndex && focusedCol === colIndex}
      as={virtualized ? 'div' : 'td'}
    />
  ))

  const sumCell = <SumCell rowSum={rowSum} rowIndex={rowIndex} as={virtualized ? 'div' : 'td'} />
  const removeButton = (
    <button type="button" onClick={onRemove}>
      Remove
    </button>
  )

  if (virtualized && gridTemplateColumns) {
    return (
      <div
        role="row"
        style={{
          display: 'grid',
          gridTemplateColumns,
          height: ROW_HEIGHT_PX,
          alignItems: 'stretch',
          minWidth: 'max-content',
        }}
      >
        <div role="rowheader" style={{ padding: '8px 10px', textAlign: 'left' }}>
          {rowIndex + 1}
        </div>
        {cells}
        {sumCell}
        <div style={{ padding: '8px 10px', textAlign: 'right' }}>{removeButton}</div>
      </div>
    )
  }

  return (
    <tr>
      <th scope="row">{rowIndex + 1}</th>
      {cells}
      {sumCell}
      <td>{removeButton}</td>
    </tr>
  )
})

export { ROW_HEIGHT_PX }

