import { memo } from 'react'
import { useMatrixUI, useMatrixActions } from '../../../entities/matrix'

type SumCellProps = {
  rowSum: number
  rowIndex: number
}

export const SumCell = memo(function SumCell({ rowSum, rowIndex }: SumCellProps) {
  const { hoveredSumRowIndex } = useMatrixUI()
  const { setHoveredSumRow } = useMatrixActions()

  const isActive = hoveredSumRowIndex === rowIndex

  return (
    <td
      data-sum-cell
      data-active={isActive || undefined}
      onMouseEnter={() => setHoveredSumRow(rowIndex)}
      onMouseLeave={() => setHoveredSumRow(null)}
    >
      {rowSum}
    </td>
  )
})
