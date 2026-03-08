export type CellId = number

export type CellValue = number

export type Cell = {
  id: CellId
  amount: CellValue
}

export type Matrix = Cell[][]

export type ContextState = {
  matrix: Matrix
  rows: number
  cols: number
  nearestCount: number
  hoveredCell: {
    rowIndex: number
    colIndex: number
    cell: Cell
  } | null
  hoveredSumRowIndex: number | null
  nextId: number
  highlightedCellIds: number[]
}
