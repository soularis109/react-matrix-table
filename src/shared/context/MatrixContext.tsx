import {
  type Dispatch,
  useEffect,
  type PropsWithChildren,
  useMemo,
  useReducer,
} from 'react'
import {
  createInitialMatrixState,
  matrixReducer,
  type MatrixAction,
  type MatrixState,
} from './matrixReducer'
import {
  MatrixDataContext,
  MatrixUIContext,
  MatrixActionsContext,
} from './MatrixContextRef'

type MatrixProviderProps = PropsWithChildren<{
  initialRows?: number
  initialCols?: number
  initialNearestCount?: number
}>

export function MatrixProvider({
  children,
  initialRows = 5,
  initialCols = 5,
  initialNearestCount = 5,
}: MatrixProviderProps) {
  const [state, dispatch] = useReducer(
    matrixReducer,
    undefined,
    () => createInitialMatrixState(initialRows, initialCols, initialNearestCount),
  ) as [MatrixState, Dispatch<MatrixAction>]

  useEffect(() => {
    if (state.matrix.length === 0) return
    const actualCols = state.matrix[0].length
    const actualRows = state.matrix.length
    const hasMismatch =
      actualCols !== state.cols ||
      actualRows !== state.rows ||
      state.matrix.some((row) => row.length !== actualCols)
    if (hasMismatch) {
      dispatch({ type: 'SET_DIMENSIONS', payload: { rows: actualRows, cols: actualCols } })
    }
  }, [state.matrix, state.rows, state.cols, dispatch])

  const dataValue = useMemo(
    () => ({
      matrix: state.matrix,
      rows: state.rows,
      cols: state.cols,
      nearestCount: state.nearestCount,
    }),
    [state.matrix, state.rows, state.cols, state.nearestCount],
  )

  const uiValue = useMemo(
    () => ({
      hoveredCell: state.hoveredCell,
      hoveredSumRowIndex: state.hoveredSumRowIndex,
      highlightedCellIdsSet: new Set(state.highlightedCellIds),
    }),
    [state.hoveredCell, state.hoveredSumRowIndex, state.highlightedCellIds],
  )

  const actionsValue = useMemo(
    () => ({
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
    [dispatch],
  )

  return (
    <MatrixDataContext.Provider value={dataValue}>
      <MatrixUIContext.Provider value={uiValue}>
        <MatrixActionsContext.Provider value={actionsValue}>{children}</MatrixActionsContext.Provider>
      </MatrixUIContext.Provider>
    </MatrixDataContext.Provider>
  )
}
