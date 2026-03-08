import { useContext } from 'react'
import {
  MatrixDataContext,
  MatrixUIContext,
  MatrixActionsContext,
} from '../context/MatrixContextRef'

export function useMatrixData() {
  const context = useContext(MatrixDataContext)
  if (!context) throw new Error('useMatrixData must be used within a MatrixProvider')
  return context
}

export function useMatrixUI() {
  const context = useContext(MatrixUIContext)
  if (!context) throw new Error('useMatrixUI must be used within a MatrixProvider')
  return context
}

export function useMatrixActions() {
  const context = useContext(MatrixActionsContext)
  if (!context) throw new Error('useMatrixActions must be used within a MatrixProvider')
  return context
}
