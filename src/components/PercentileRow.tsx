import { useMatrix } from '../hooks/useMatrix'
import { calculatePercentile } from '../utils/calculatePercentile'

export function PercentileRow() {
  const {
    state: { matrix, cols },
  } = useMatrix()

  const percentiles: (number | null)[] = []

  for (let colIndex = 0; colIndex < cols; colIndex += 1) {
    const columnValues = matrix
      .map((row) => row[colIndex])
      .filter((cell) => cell !== undefined)
      .map((cell) => cell.amount)

    const value = calculatePercentile(columnValues, 60)
    percentiles.push(value)
  }

  return (
    <tr>
      <th scope="row">60th percentile</th>
      {percentiles.map((value, index) => (
        <td key={index}>{value === null ? '-' : value}</td>
      ))}
      <td />
      <td />
    </tr>
  )
}

