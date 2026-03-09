import { memo, useCallback, useMemo } from 'react'
import type { Cell } from '@shared/types/matrix'
import { useMatrixUI } from '@shared/hooks/useMatrix'
import { calculateRowSum } from '@shared/lib/matrix/calculateRowSum'
import { calculateRowMax } from '@shared/lib/matrix/calculateRowMax'
import { MatrixCell } from './MatrixCell'
import { SumCell } from './SumCell'

type MatrixRowProps = {
  row: Cell[]
  rowIndex: number
  removeRow: (rowIndex: number) => void
  isNewRow?: boolean
}

export const MatrixRow = memo(function MatrixRow({
  row,
  rowIndex,
  removeRow,
  isNewRow = false,
}: MatrixRowProps) {
  const { hoveredSumRowIndex } = useMatrixUI()

  const onRemove = useCallback(() => removeRow(rowIndex), [removeRow, rowIndex])

  const rowSum = useMemo(() => calculateRowSum(row), [row])
  const rowMax = useMemo(() => calculateRowMax(row), [row])
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
    />
  ))

  const sumCell = <SumCell rowSum={rowSum} rowIndex={rowIndex} />
  const removeButton = (
    <button type="button" onClick={onRemove}>
      Remove
    </button>
  )

  return (
    <tr data-new-row={isNewRow || undefined}>
      <th scope="row">{rowIndex + 1}</th>
      {cells}
      {sumCell}
      <td>{removeButton}</td>
    </tr>
  )
})
