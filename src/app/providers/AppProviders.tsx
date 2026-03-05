import type { PropsWithChildren } from 'react'
import { MatrixProvider } from '@entities/matrix'

export function AppProviders({ children }: PropsWithChildren) {
  return <MatrixProvider>{children}</MatrixProvider>
}

