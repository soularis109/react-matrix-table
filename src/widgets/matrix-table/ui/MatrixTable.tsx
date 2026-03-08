import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useMatrixData, useMatrixActions, MAX_ROWS_COLS } from '../../../entities/matrix'
import { MatrixRow } from './MatrixRow'
import { PercentileRow } from './PercentileRow'

function clampInputValue(raw: string, min: number, max: number): string {
  if (raw === '' || raw === '-') return raw
  const value = Number.parseInt(raw, 10)
  if (Number.isNaN(value)) return raw
  if (value < min) return String(min)
  if (value > max) return String(max)
  return raw
}

type MatrixTableHeaderProps = {
  rows: number
  cols: number
  nearestCount: number
  maxX: number
  isXDisabled: boolean
  setDimensions: (rows: number, cols: number) => void
  setNearestCount: (count: number) => void
}

function MatrixTableHeader({
  rows,
  cols,
  nearestCount,
  maxX,
  isXDisabled,
  setDimensions,
  setNearestCount,
}: MatrixTableHeaderProps) {
  const [rowsInput, setRowsInput] = useState(() => String(rows))
  const [colsInput, setColsInput] = useState(() => String(cols))
  const [nearestInput, setNearestInput] = useState(() => String(nearestCount))

  const handleRowsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = clampInputValue(event.target.value, 0, MAX_ROWS_COLS)
      setRowsInput(raw)
      const value = Number.parseInt(raw, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= MAX_ROWS_COLS) {
        setDimensions(value, cols)
      }
    },
    [cols, setDimensions],
  )

  const handleColsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = clampInputValue(event.target.value, 0, MAX_ROWS_COLS)
      setColsInput(raw)
      const value = Number.parseInt(raw, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= MAX_ROWS_COLS) {
        setDimensions(rows, value)
      }
    },
    [rows, setDimensions],
  )

  const handleNearestChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = clampInputValue(event.target.value, 0, maxX)
      setNearestInput(raw)
      const value = Number.parseInt(raw, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= maxX) {
        setNearestCount(value)
      }
    },
    [maxX, setNearestCount],
  )

  return (
    <div>
      <label>
        Rows (M)
        <input
          type="number"
          min={0}
          max={MAX_ROWS_COLS}
          value={rowsInput}
          onChange={handleRowsChange}
        />
      </label>
      <label>
        Columns (N)
        <input
          type="number"
          min={0}
          max={MAX_ROWS_COLS}
          value={colsInput}
          onChange={handleColsChange}
        />
      </label>
      <label>
        Nearest cells (X)
        <input
          type="number"
          min={0}
          max={maxX}
          value={nearestInput}
          onChange={handleNearestChange}
          disabled={isXDisabled}
          title={isXDisabled ? 'Need matrix with at least 2 cells' : undefined}
          aria-label={isXDisabled ? 'Nearest cells (need at least 2 cells in matrix)' : 'Nearest cells (X)'}
        />
      </label>
    </div>
  )
}

export function MatrixTable() {
  const { matrix, rows, cols, nearestCount } = useMatrixData()
  const { setDimensions, setNearestCount, addRow, removeRow } = useMatrixActions()

  const [lastAddedRowIndex, setLastAddedRowIndex] = useState<number | null>(null)

  useEffect(() => {
    if (lastAddedRowIndex === null) return
    const t = setTimeout(() => setLastAddedRowIndex(null), 320)
    return () => clearTimeout(t)
  }, [lastAddedRowIndex])

  const displayCols = useMemo(
    () => (matrix.length > 0 ? matrix[0].length : cols),
    [matrix, cols],
  )
  const maxX = useMemo(() => Math.max(0, rows * cols - 1), [rows, cols])
  const isXDisabled = useMemo(() => rows * cols <= 1, [rows, cols])
  const isAddRowDisabled = useMemo(() => rows >= MAX_ROWS_COLS, [rows])

  const handleAddRow = useCallback(() => {
    addRow()
    setLastAddedRowIndex(rows)
  }, [addRow, rows])

  const colWidths = useMemo(() => {
    const rowHeaderPct = 4
    const sumPct = 8
    const actionsPct = 7
    const dataColPct =
      displayCols > 0 ? (100 - rowHeaderPct - sumPct - actionsPct) / displayCols : 0
    return { rowHeaderPct, sumPct, actionsPct, dataColPct }
  }, [displayCols])

  const colgroupCols = useMemo(
    () => Array.from({ length: displayCols }, (_, i) => i),
    [displayCols],
  )

  return (
    <section className="matrix-section">
      <header>
        <h1>Matrix table</h1>
        <MatrixTableHeader
          key={`${rows}-${cols}-${nearestCount}`}
          rows={rows}
          cols={cols}
          nearestCount={nearestCount}
          maxX={maxX}
          isXDisabled={isXDisabled}
          setDimensions={setDimensions}
          setNearestCount={setNearestCount}
        />
      </header>

      <div className="matrix-table-scroll">
        <table className="matrix-table">
          <colgroup>
            <col style={{ width: `${colWidths.rowHeaderPct}%` }} />
            {colgroupCols.map((i) => (
              <col key={i} style={{ width: `${colWidths.dataColPct}%` }} />
            ))}
            <col style={{ width: `${colWidths.sumPct}%` }} />
            <col style={{ width: `${colWidths.actionsPct}%` }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">#</th>
              {colgroupCols.map((index) => (
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
                removeRow={removeRow}
                isNewRow={lastAddedRowIndex === rowIndex}
              />
            ))}
            {rows > 0 && cols > 0 && <PercentileRow />}
          </tbody>
        </table>
      </div>

      <footer>
        <button type="button" onClick={handleAddRow} disabled={isAddRowDisabled}>
          Add row
        </button>
      </footer>
    </section>
  )
}
