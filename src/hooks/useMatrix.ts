import { useContext } from 'react'
import { MatrixContext } from '../context/MatrixContext'

export function useMatrix() {
  const context = useContext(MatrixContext)

  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider')
  }

  return context
}

