import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMatrix } from '../../../entities/matrix'
import { MatrixRow, ROW_HEIGHT_PX } from './MatrixRow'
import { PercentileRow } from './PercentileRow'

const VIRTUAL_THRESHOLD = 25
const TABLE_BODY_MAX_HEIGHT = '60vh'
const SKELETON_DELAY_MS = 220

function MatrixTableSkeleton() {
  const cols = 5
  const skeletonRows = 6
  return (
    <section aria-busy="true" aria-label="Loading matrix">
      <header className="skeleton-header">
        <div className="skeleton skeleton-title" />
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="skeleton skeleton-input" />
          <div className="skeleton skeleton-input" />
          <div className="skeleton skeleton-input" />
        </div>
      </header>
      <div style={{ overflowX: 'auto', marginTop: 8 }}>
        <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px 12px', textAlign: 'left', width: 48 }} />
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} style={{ padding: '8px 12px', width: 80 }} />
              ))}
              <th style={{ padding: '8px 12px', width: 96 }} />
              <th style={{ padding: '8px 12px', width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="skeleton-row">
                <th style={{ textAlign: 'left' }}>
                  <div className="skeleton skeleton-cell" style={{ width: 24 }} />
                </th>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <td key={colIndex}>
                    <div className="skeleton skeleton-cell" />
                  </td>
                ))}
                <td><div className="skeleton skeleton-cell" style={{ minWidth: 56 }} /></td>
                <td><div className="skeleton skeleton-cell" style={{ minWidth: 64 }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <div className="skeleton" style={{ height: 36, width: 100, borderRadius: 999 }} />
      </footer>
    </section>
  )
}

export function MatrixTable() {
  const { state, setDimensions, setNearestCount, addRow, removeRow, incrementCell, clearHoveredCell } = useMatrix()
  const { matrix, rows, cols, nearestCount } = state
  const [focusedRow, setFocusedRow] = useState(0)
  const [focusedCol, setFocusedCol] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollReady, setScrollReady] = useState(false)
  const [isReady, setIsReady] = useState(() => typeof window !== 'undefined' && window.__SKIP_SKELETON__ === true)

  useEffect(() => {
    if (isReady) return
    const t = setTimeout(() => setIsReady(true), SKELETON_DELAY_MS)
    return () => clearTimeout(t)
  }, [isReady])

  const useVirtual = rows > VIRTUAL_THRESHOLD
  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: 8,
    enabled: useVirtual,
  })

  const setScrollRef = useCallback((el: HTMLDivElement | null) => {
    (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    if (el) setScrollReady(true)
  }, [])

  const gridTemplateColumns = useVirtual
    ? `48px ${Array(cols).fill('minmax(64px, 1fr)').join(' ')} 96px 80px`
    : undefined

  const clampedRow = Math.max(0, Math.min(focusedRow, rows - 1))
  const clampedCol = Math.max(0, Math.min(focusedCol, cols - 1))

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (rows <= 0 || cols <= 0) return
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          setFocusedCol((c) => Math.max(0, c - 1))
          break
        case 'ArrowRight':
          event.preventDefault()
          setFocusedCol((c) => Math.min(cols - 1, c + 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedRow((r) => Math.max(0, r - 1))
          break
        case 'ArrowDown':
          event.preventDefault()
          setFocusedRow((r) => Math.min(rows - 1, r + 1))
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          incrementCell(clampedRow, clampedCol)
          break
        case 'Escape':
          event.preventDefault()
          clearHoveredCell()
          break
        default:
          break
      }
    },
    [rows, cols, clampedRow, clampedCol, incrementCell, clearHoveredCell],
  )

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

  if (!isReady) {
    return <MatrixTableSkeleton />
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

      <div
        role="grid"
        aria-label="Matrix table"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="matrix-table-keyboard"
      >
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
          {!useVirtual && (
            <tbody>
              {matrix.map((row, rowIndex) => (
                <MatrixRow
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  onRemove={() => removeRow(rowIndex)}
                  focusedRow={clampedRow}
                  focusedCol={clampedCol}
                />
              ))}
              {rows > 0 && cols > 0 && <PercentileRow />}
            </tbody>
          )}
        </table>
        {useVirtual && rows > 0 && cols > 0 && (
          <div
            ref={setScrollRef}
            style={{
              overflowY: 'auto',
              overflowX: 'auto',
              height: TABLE_BODY_MAX_HEIGHT,
              minHeight: 320,
              position: 'relative',
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
                minWidth: 'max-content',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <MatrixRow
                    row={matrix[virtualRow.index]}
                    rowIndex={virtualRow.index}
                    onRemove={() => removeRow(virtualRow.index)}
                    focusedRow={clampedRow}
                    focusedCol={clampedCol}
                    virtualized
                    gridTemplateColumns={gridTemplateColumns}
                  />
                </div>
              ))}
            </div>
            <table style={{ width: '100%', marginTop: 0 }}>
              <tbody>
                <PercentileRow />
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer>
        <button type="button" onClick={addRow}>
          Add row
        </button>
      </footer>
    </section>
  )
}

