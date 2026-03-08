import { memo, useMemo } from 'react'
import { useMatrixData } from '../../../entities/matrix'
import { calculatePercentile } from '../../../entities/matrix'

export const PercentileRow = memo(function PercentileRow() {
  const { matrix, cols } = useMatrixData()

  const percentiles = useMemo(() => {
    const result: (number | null)[] = []
    for (let colIndex = 0; colIndex < cols; colIndex += 1) {
      const columnValues = matrix
        .map((row) => row[colIndex]?.amount)
        .filter((v): v is number => typeof v === 'number')
      result.push(calculatePercentile(columnValues, 60))
    }
    return result
  }, [matrix, cols])

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
})
