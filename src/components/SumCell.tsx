import { useMatrix } from '../hooks/useMatrix'

type SumCellProps = {
  rowSum: number
  rowIndex: number
}

export function SumCell({ rowSum, rowIndex }: SumCellProps) {
  const {
    state: { hoveredSumRowIndex },
  } = useMatrix()

  const isActive = hoveredSumRowIndex === rowIndex

  return (
    <td data-sum-cell data-active={isActive || undefined}>
      {rowSum}
    </td>
  )
}

