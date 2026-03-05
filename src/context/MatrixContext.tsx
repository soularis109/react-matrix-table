import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
  useReducer,
} from 'react'
import type { Cell, Matrix } from '../types/matrix'
import { generateMatrix } from '../utils/generateMatrix'
import { findClosestCells } from '../utils/findClosestCells'

export type HoveredCell = {
  rowIndex: number
  colIndex: number
  cell: Cell
}

export type MatrixState = {
  matrix: Matrix
  rows: number
  cols: number
  nearestCount: number
  hoveredCell: HoveredCell | null
  highlightedCellIds: number[]
  hoveredSumRowIndex: number | null
  nextId: number
}

type SetDimensionsAction = {
  type: 'SET_DIMENSIONS'
  payload: { rows: number; cols: number }
}

type SetNearestCountAction = {
  type: 'SET_NEAREST_COUNT'
  payload: { nearestCount: number }
}

type IncrementCellAction = {
  type: 'INCREMENT_CELL'
  payload: { rowIndex: number; colIndex: number }
}

type AddRowAction = {
  type: 'ADD_ROW'
}

type RemoveRowAction = {
  type: 'REMOVE_ROW'
  payload: { rowIndex: number }
}

type SetHoveredCellAction = {
  type: 'SET_HOVERED_CELL'
  payload: { rowIndex: number; colIndex: number }
}

type ClearHoveredCellAction = {
  type: 'CLEAR_HOVERED_CELL'
}

type SetHoveredSumRowAction = {
  type: 'SET_HOVERED_SUM_ROW'
  payload: { rowIndex: number | null }
}

export type MatrixAction =
  | SetDimensionsAction
  | SetNearestCountAction
  | IncrementCellAction
  | AddRowAction
  | RemoveRowAction
  | SetHoveredCellAction
  | ClearHoveredCellAction
  | SetHoveredSumRowAction

export function getMaxNearestCount(state: Pick<MatrixState, 'rows' | 'cols'>): number {
  const totalCells = state.rows * state.cols
  return Math.max(0, totalCells - 1)
}

function clampNearestCount(state: MatrixState, requested: number): number {
  const max = getMaxNearestCount(state)
  if (requested < 0) return 0
  if (requested > max) return max
  return requested
}

function recalcHighlights(state: MatrixState): MatrixState {
  if (!state.hoveredCell || state.nearestCount <= 0) {
    return {
      ...state,
      highlightedCellIds: [],
    }
  }

  const { cell } = state.hoveredCell
  const count = clampNearestCount(state, state.nearestCount)

  const highlightedCellIds = findClosestCells(state.matrix, cell, count)

  return {
    ...state,
    nearestCount: count,
    highlightedCellIds,
  }
}

export function createInitialMatrixState(
  rows: number,
  cols: number,
  nearestCount: number,
): MatrixState {
  const safeRows = rows < 0 ? 0 : rows
  const safeCols = cols < 0 ? 0 : cols
  const matrix = generateMatrix(safeRows, safeCols)
  const totalCells = safeRows * safeCols
  const nextId = totalCells + 1

  const base: MatrixState = {
    matrix,
    rows: safeRows,
    cols: safeCols,
    nearestCount,
    hoveredCell: null,
    highlightedCellIds: [],
    hoveredSumRowIndex: null,
    nextId,
  }

  const clampedNearestCount = clampNearestCount(base, nearestCount)

  return {
    ...base,
    nearestCount: clampedNearestCount,
  }
}

export function matrixReducer(state: MatrixState, action: MatrixAction): MatrixState {
  switch (action.type) {
    case 'SET_DIMENSIONS': {
      const { rows, cols } = action.payload
      const nextState = createInitialMatrixState(rows, cols, state.nearestCount)
      return {
        ...nextState,
        hoveredCell: null,
        hoveredSumRowIndex: null,
        highlightedCellIds: [],
      }
    }

    case 'SET_NEAREST_COUNT': {
      const count = clampNearestCount(state, action.payload.nearestCount)
      const updated: MatrixState = {
        ...state,
        nearestCount: count,
      }
      return recalcHighlights(updated)
    }

    case 'INCREMENT_CELL': {
      const { rowIndex, colIndex } = action.payload
      if (
        rowIndex < 0 ||
        rowIndex >= state.rows ||
        colIndex < 0 ||
        colIndex >= state.cols
      ) {
        return state
      }

      const matrix = state.matrix.map((row, r) =>
        r === rowIndex
          ? row.map((cell, c) =>
              c === colIndex ? { ...cell, amount: cell.amount + 1 } : cell,
            )
          : row,
      )

      const updated: MatrixState = {
        ...state,
        matrix,
      }

      return recalcHighlights(updated)
    }

    case 'ADD_ROW': {
      if (state.cols <= 0) {
        return {
          ...state,
          matrix: [...state.matrix, []],
          rows: state.rows + 1,
        }
      }

      const newRowMatrix = generateMatrix(1, state.cols, state.nextId)
      const newRow = newRowMatrix[0]
      const nextId = state.nextId + state.cols

      const updated: MatrixState = {
        ...state,
        matrix: [...state.matrix, newRow],
        rows: state.rows + 1,
        nextId,
      }

      return recalcHighlights(updated)
    }

    case 'REMOVE_ROW': {
      const { rowIndex } = action.payload
      if (rowIndex < 0 || rowIndex >= state.rows) {
        return state
      }

      const matrix = state.matrix.filter((_, index) => index !== rowIndex)
      const rows = state.rows - 1

      let hoveredCell = state.hoveredCell
      if (hoveredCell) {
        if (hoveredCell.rowIndex === rowIndex) {
          hoveredCell = null
        } else if (hoveredCell.rowIndex > rowIndex) {
          hoveredCell = {
            ...hoveredCell,
            rowIndex: hoveredCell.rowIndex - 1,
          }
        }
      }

      let hoveredSumRowIndex = state.hoveredSumRowIndex
      if (hoveredSumRowIndex !== null) {
        if (hoveredSumRowIndex === rowIndex) {
          hoveredSumRowIndex = null
        } else if (hoveredSumRowIndex > rowIndex) {
          hoveredSumRowIndex -= 1
        }
      }

      const updated: MatrixState = {
        ...state,
        matrix,
        rows,
        hoveredCell,
        hoveredSumRowIndex,
      }

      return recalcHighlights(updated)
    }

    case 'SET_HOVERED_CELL': {
      const { rowIndex, colIndex } = action.payload
      if (
        rowIndex < 0 ||
        rowIndex >= state.rows ||
        colIndex < 0 ||
        colIndex >= state.cols
      ) {
        return state
      }

      const cell = state.matrix[rowIndex][colIndex]
      const hoveredCell: HoveredCell = { rowIndex, colIndex, cell }

      const updated: MatrixState = {
        ...state,
        hoveredCell,
      }

      return recalcHighlights(updated)
    }

    case 'CLEAR_HOVERED_CELL': {
      return {
        ...state,
        hoveredCell: null,
        highlightedCellIds: [],
      }
    }

    case 'SET_HOVERED_SUM_ROW': {
      const { rowIndex } = action.payload

      if (rowIndex !== null && (rowIndex < 0 || rowIndex >= state.rows)) {
        return state
      }

      return {
        ...state,
        hoveredSumRowIndex: rowIndex,
        hoveredCell: rowIndex !== null ? null : state.hoveredCell,
        highlightedCellIds: rowIndex !== null ? [] : state.highlightedCellIds,
      }
    }

    default:
      return state
  }
}

export type MatrixContextValue = {
  state: MatrixState
  setDimensions: (rows: number, cols: number) => void
  setNearestCount: (nearestCount: number) => void
  incrementCell: (rowIndex: number, colIndex: number) => void
  addRow: () => void
  removeRow: (rowIndex: number) => void
  setHoveredCell: (rowIndex: number, colIndex: number) => void
  clearHoveredCell: () => void
  setHoveredSumRow: (rowIndex: number | null) => void
}

export const MatrixContext = createContext<MatrixContextValue | undefined>(undefined)

type MatrixProviderProps = PropsWithChildren<{
  initialRows?: number
  initialCols?: number
  initialNearestCount?: number
}>

function matrixReducerWithDispatch(
  state: MatrixState,
  action: MatrixAction,
): MatrixState {
  return matrixReducer(state, action)
}

export function MatrixProvider({
  children,
  initialRows = 5,
  initialCols = 5,
  initialNearestCount = 5,
}: MatrixProviderProps): ReactNode {
  const [state, dispatch]: [MatrixState, Dispatch<MatrixAction>] = useReducer(
    matrixReducerWithDispatch,
    undefined,
    () => createInitialMatrixState(initialRows, initialCols, initialNearestCount),
  )

  const value: MatrixContextValue = useMemo(
    () => ({
      state,
      setDimensions: (rows: number, cols: number) =>
        dispatch({ type: 'SET_DIMENSIONS', payload: { rows, cols } }),
      setNearestCount: (nearestCount: number) =>
        dispatch({ type: 'SET_NEAREST_COUNT', payload: { nearestCount } }),
      incrementCell: (rowIndex: number, colIndex: number) =>
        dispatch({ type: 'INCREMENT_CELL', payload: { rowIndex, colIndex } }),
      addRow: () => dispatch({ type: 'ADD_ROW' }),
      removeRow: (rowIndex: number) =>
        dispatch({ type: 'REMOVE_ROW', payload: { rowIndex } }),
      setHoveredCell: (rowIndex: number, colIndex: number) =>
        dispatch({ type: 'SET_HOVERED_CELL', payload: { rowIndex, colIndex } }),
      clearHoveredCell: () => dispatch({ type: 'CLEAR_HOVERED_CELL' }),
      setHoveredSumRow: (rowIndex: number | null) =>
        dispatch({ type: 'SET_HOVERED_SUM_ROW', payload: { rowIndex } }),
    }),
    [state],
  )

  return <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>
}

