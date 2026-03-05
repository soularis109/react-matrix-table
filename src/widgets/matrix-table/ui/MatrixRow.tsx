import type { Cell } from '../../../entities/matrix'
import { useMatrix } from '../../../entities/matrix'
import { calculateRowSum } from '../../../entities/matrix'
import { MatrixCell } from './MatrixCell'
import { SumCell } from './SumCell'

type MatrixRowProps = {
  row: Cell[]
  rowIndex: number
  onRemove: () => void
}

export function MatrixRow({ row, rowIndex, onRemove }: MatrixRowProps) {
  const {
    state: { hoveredSumRowIndex },
  } = useMatrix()

  const rowSum = calculateRowSum(row)
  const rowMax = row.reduce((max, cell) => (cell.amount > max ? cell.amount : max), 0)
  const isPercentageMode = hoveredSumRowIndex === rowIndex

  return (
    <tr>
      <th scope="row">{rowIndex + 1}</th>
      {row.map((cell, colIndex) => (
        <MatrixCell
          key={cell.id}
          cell={cell}
          rowIndex={rowIndex}
          colIndex={colIndex}
          isPercentageMode={isPercentageMode}
          rowSum={rowSum}
          rowMax={rowMax}
        />
      ))}
      <SumCell rowSum={rowSum} rowIndex={rowIndex} />
      <td>
        <button type="button" onClick={onRemove}>
          Remove
        </button>
      </td>
    </tr>
  )
}

