import type { PropsWithChildren } from 'react'
import { MatrixProvider } from '@shared/context/MatrixContext'

export function AppProviders({ children }: PropsWithChildren) {
  return <MatrixProvider>{children}</MatrixProvider>
}

