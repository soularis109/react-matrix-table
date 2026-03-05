import { describe, expect, it } from 'vitest'
import type { Matrix } from '../../types/matrix'
import {
  createInitialMatrixState,
  getMaxNearestCount,
  matrixReducer,
  type MatrixState,
} from '../MatrixContext'

const createSimpleState = (matrix: Matrix, nearestCount = 2): MatrixState => {
  const rows = matrix.length
  const cols = rows > 0 ? matrix[0].length : 0
  const maxId = matrix.flat().reduce((max, cell) => (cell.id > max ? cell.id : max), 0)

  return {
    matrix,
    rows,
    cols,
    nearestCount,
    hoveredCell: null,
    highlightedCellIds: [],
    hoveredSumRowIndex: null,
    nextId: maxId + 1,
  }
}

describe('MatrixContext reducer', () => {
  it('creates initial state with given dimensions and unique ids', () => {
    const state = createInitialMatrixState(3, 4, 2)

    expect(state.rows).toBe(3)
    expect(state.cols).toBe(4)
    expect(state.matrix).toHaveLength(3)
    state.matrix.forEach((row) => {
      expect(row).toHaveLength(4)
    })

    const ids = state.matrix.flat().map((cell) => cell.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)

    // nearestCount should be clamped to valid range
    const maxNearest = getMaxNearestCount(state)
    expect(state.nearestCount).toBeLessThanOrEqual(maxNearest)
  })

  it('sets dimensions and regenerates matrix, clamping nearestCount', () => {
    const initial = createInitialMatrixState(2, 2, 10)

    const next = matrixReducer(initial, {
      type: 'SET_DIMENSIONS',
      payload: { rows: 1, cols: 3 },
    })

    expect(next.rows).toBe(1)
    expect(next.cols).toBe(3)
    expect(next.matrix).toHaveLength(1)
    expect(next.matrix[0]).toHaveLength(3)

    const maxNearest = getMaxNearestCount(next)
    expect(next.nearestCount).toBeLessThanOrEqual(maxNearest)
    expect(next.hoveredCell).toBeNull()
    expect(next.hoveredSumRowIndex).toBeNull()
    expect(next.highlightedCellIds).toEqual([])
  })

  it('increments a specific cell amount', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
      ],
      [
        { id: 3, amount: 30 },
        { id: 4, amount: 40 },
      ],
    ]

    const initial = createSimpleState(matrix)

    const next = matrixReducer(initial, {
      type: 'INCREMENT_CELL',
      payload: { rowIndex: 0, colIndex: 1 },
    })

    expect(next.matrix[0][1].amount).toBe(21)
    expect(next.matrix[0][0].amount).toBe(10)
    expect(next.matrix[1][1].amount).toBe(40)
  })

  it('adds a new row with the same number of columns', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
      ],
    ]

    const initial = createSimpleState(matrix)

    const next = matrixReducer(initial, { type: 'ADD_ROW' })

    expect(next.rows).toBe(2)
    expect(next.matrix).toHaveLength(2)
    expect(next.matrix[1]).toHaveLength(initial.cols)

    const ids = next.matrix.flat().map((cell) => cell.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('removes a row and adjusts hover state', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
      ],
      [
        { id: 3, amount: 30 },
        { id: 4, amount: 40 },
      ],
    ]

    const base = createSimpleState(matrix)
    const withHover: MatrixState = {
      ...base,
      hoveredCell: {
        rowIndex: 1,
        colIndex: 0,
        cell: matrix[1][0],
      },
      hoveredSumRowIndex: 1,
    }

    const next = matrixReducer(withHover, {
      type: 'REMOVE_ROW',
      payload: { rowIndex: 1 },
    })

    expect(next.rows).toBe(1)
    expect(next.matrix).toHaveLength(1)
    expect(next.hoveredCell).toBeNull()
    expect(next.hoveredSumRowIndex).toBeNull()
  })

  it('sets hovered cell and calculates highlighted closest cells', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
        { id: 3, amount: 30 },
      ],
    ]
    const initial: MatrixState = {
      ...createSimpleState(matrix, 2),
      nearestCount: 2,
    }

    const next = matrixReducer(initial, {
      type: 'SET_HOVERED_CELL',
      payload: { rowIndex: 0, colIndex: 1 },
    })

    expect(next.hoveredCell).not.toBeNull()
    expect(next.hoveredCell?.cell.id).toBe(2)
    expect(next.highlightedCellIds).toHaveLength(2)
    // closest to 20 should be 10 (id 1) and 30 (id 3)
    expect(next.highlightedCellIds).toEqual([1, 3])
  })

  it('clears hovered cell and highlighted ids', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
      ],
    ]
    const initial: MatrixState = {
      ...createSimpleState(matrix),
      hoveredCell: {
        rowIndex: 0,
        colIndex: 0,
        cell: matrix[0][0],
      },
      highlightedCellIds: [2],
    }

    const next = matrixReducer(initial, { type: 'CLEAR_HOVERED_CELL' })

    expect(next.hoveredCell).toBeNull()
    expect(next.highlightedCellIds).toEqual([])
  })

  it('sets hovered sum row and clears cell highlighting', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
      ],
      [
        { id: 3, amount: 30 },
        { id: 4, amount: 40 },
      ],
    ]

    const initial: MatrixState = {
      ...createSimpleState(matrix),
      hoveredCell: {
        rowIndex: 0,
        colIndex: 0,
        cell: matrix[0][0],
      },
      highlightedCellIds: [2, 3],
    }

    const next = matrixReducer(initial, {
      type: 'SET_HOVERED_SUM_ROW',
      payload: { rowIndex: 1 },
    })

    expect(next.hoveredSumRowIndex).toBe(1)
    expect(next.hoveredCell).toBeNull()
    expect(next.highlightedCellIds).toEqual([])
  })

  it('clamps nearestCount based on matrix size and recomputes highlights', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
      ],
      [
        { id: 3, amount: 30 },
        { id: 4, amount: 40 },
      ],
    ]

    const initial: MatrixState = {
      ...createSimpleState(matrix),
      nearestCount: 1,
      hoveredCell: {
        rowIndex: 0,
        colIndex: 0,
        cell: matrix[0][0],
      },
    }

    const next = matrixReducer(initial, {
      type: 'SET_NEAREST_COUNT',
      payload: { nearestCount: 10 },
    })

    const maxNearest = getMaxNearestCount(next)

    expect(next.nearestCount).toBe(maxNearest)
    expect(next.highlightedCellIds.length).toBeLessThanOrEqual(maxNearest)
  })

  it('handles empty matrix (M=0, N=0)', () => {
    const state = createInitialMatrixState(0, 0, 0)

    expect(state.rows).toBe(0)
    expect(state.cols).toBe(0)
    expect(state.matrix).toHaveLength(0)
    expect(state.nextId).toBe(1)
    expect(getMaxNearestCount(state)).toBe(0)
  })

  it('with X=0 highlights no cells on hover', () => {
    const matrix: Matrix = [
      [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
      ],
    ]
    const initial: MatrixState = {
      ...createSimpleState(matrix, 0),
      nearestCount: 0,
    }

    const next = matrixReducer(initial, {
      type: 'SET_HOVERED_CELL',
      payload: { rowIndex: 0, colIndex: 0 },
    })

    expect(next.hoveredCell).not.toBeNull()
    expect(next.highlightedCellIds).toHaveLength(0)
  })
})

