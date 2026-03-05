import { memo } from 'react'
import { useMatrix } from '../../../entities/matrix'

type SumCellProps = {
  rowSum: number
  rowIndex: number
  as?: 'td' | 'div'
}

export const SumCell = memo(function SumCell({ rowSum, rowIndex, as = 'td' }: SumCellProps) {
  const {
    state: { hoveredSumRowIndex },
    setHoveredSumRow,
  } = useMatrix()

  const isActive = hoveredSumRowIndex === rowIndex

  const props = {
    'data-sum-cell': true,
    'data-active': isActive || undefined,
    onMouseEnter: () => setHoveredSumRow(rowIndex),
    onMouseLeave: () => setHoveredSumRow(null),
  }

  if (as === 'div') {
    return <div role="gridcell" {...props}>{rowSum}</div>
  }
  return <td {...props}>{rowSum}</td>
})

