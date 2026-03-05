import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MatrixProvider } from '../../context/MatrixContext'
import { MatrixTable } from '../MatrixTable'

const renderWithProvider = () =>
  render(
    <MatrixProvider initialRows={3} initialCols={4} initialNearestCount={2}>
      <MatrixTable />
    </MatrixProvider>,
  )

describe('MatrixTable', () => {
  it('renders table with correct headers and data structure', () => {
    renderWithProvider()

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    // header cells: index column + 4 data cols + Row SUM + Actions
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(1 + 4 + 2)
    expect(screen.getByText(/Row SUM/i)).toBeInTheDocument()

    // body rows: 3 data rows + 1 percentile row
    const rows = screen.getAllByRole('row')
    // 1 header row + 3 data rows + 1 percentile row
    expect(rows).toHaveLength(1 + 3 + 1)

    expect(screen.getByText(/60th percentile/i)).toBeInTheDocument()
  })

  it('renders controls for M, N and X', () => {
    renderWithProvider()

    expect(screen.getByLabelText(/Rows \(M\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Columns \(N\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nearest cells \(X\)/i)).toBeInTheDocument()
  })
})

