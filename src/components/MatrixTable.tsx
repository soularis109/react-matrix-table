import { ChangeEvent } from 'react'
import { useMatrix } from '../hooks/useMatrix'
import { MatrixRow } from './MatrixRow'
import { PercentileRow } from './PercentileRow'

export function MatrixTable() {
  const { state, setDimensions, setNearestCount, addRow, removeRow } = useMatrix()
  const { matrix, rows, cols, nearestCount } = state

  const handleRowsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10)
    const safe = Number.isNaN(value) ? 0 : value
    setDimensions(Math.max(0, Math.min(100, safe)), cols)
  }

  const handleColsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10)
    const safe = Number.isNaN(value) ? 0 : value
    setDimensions(rows, Math.max(0, Math.min(100, safe)))
  }

  const handleNearestChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10)
    const safe = Number.isNaN(value) ? 0 : value
    setNearestCount(Math.max(0, safe))
  }

  return (
    <section>
      <header>
        <h1>Matrix table</h1>
        <div>
          <label>
            Rows (M)
            <input
              type="number"
              min={0}
              max={100}
              value={rows}
              onChange={handleRowsChange}
            />
          </label>
          <label>
            Columns (N)
            <input
              type="number"
              min={0}
              max={100}
              value={cols}
              onChange={handleColsChange}
            />
          </label>
          <label>
            Nearest cells (X)
            <input
              type="number"
              min={0}
              value={nearestCount}
              onChange={handleNearestChange}
            />
          </label>
        </div>
      </header>

      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">#</th>
              {Array.from({ length: cols }).map((_, index) => (
                <th key={index} scope="col">
                  {index + 1}
                </th>
              ))}
              <th scope="col">Row SUM</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <MatrixRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                onRemove={() => removeRow(rowIndex)}
              />
            ))}
            {rows > 0 && cols > 0 && <PercentileRow />}
          </tbody>
        </table>
      </div>

      <footer>
        <button type="button" onClick={addRow}>
          Add row
        </button>
      </footer>
    </section>
  )
}

