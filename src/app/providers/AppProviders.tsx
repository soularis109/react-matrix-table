import type { PropsWithChildren } from 'react'
import { MatrixProvider } from '../../context/MatrixContext'

export function AppProviders({ children }: PropsWithChildren) {
  return <MatrixProvider>{children}</MatrixProvider>
}

