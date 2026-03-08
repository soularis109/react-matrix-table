import { createContext } from 'react'
import type { Cell, Matrix } from '../types/matrix'

export type MatrixData = {
  matrix: Matrix
  rows: number
  cols: number
  nearestCount: number
}

export type MatrixUI = {
  hoveredCell: { rowIndex: number; colIndex: number; cell: Cell } | null
  hoveredSumRowIndex: number | null
  highlightedCellIdsSet: Set<number>
}

export type MatrixActions = {
  setDimensions: (rows: number, cols: number) => void
  setNearestCount: (nearestCount: number) => void
  incrementCell: (rowIndex: number, colIndex: number) => void
  addRow: () => void
  removeRow: (rowIndex: number) => void
  setHoveredCell: (rowIndex: number, colIndex: number) => void
  clearHoveredCell: () => void
  setHoveredSumRow: (rowIndex: number | null) => void
}

export const MatrixDataContext = createContext<MatrixData | undefined>(undefined)
export const MatrixUIContext = createContext<MatrixUI | undefined>(undefined)
export const MatrixActionsContext = createContext<MatrixActions | undefined>(undefined)
