import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MatrixProvider } from '@shared/context/MatrixContext'
import { MatrixTable } from '..'

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

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(1 + 4 + 2)
    expect(screen.getByText(/Row SUM/i)).toBeInTheDocument()

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(1 + 3 + 1)

    expect(screen.getByText(/60th percentile/i)).toBeInTheDocument()
  })

  it('renders controls for M, N and X', () => {
    renderWithProvider()

    expect(screen.getByLabelText(/Rows \(M\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Columns \(N\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nearest cells \(X\)/i)).toBeInTheDocument()
  })

  it('increments cell value on click and keeps sums/percentiles consistent', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProvider()

    const cells = screen.getAllByRole('cell')
    const firstDataCell = cells[0]

    const initialValue = Number.parseInt(firstDataCell.textContent ?? '0', 10)
    await user.click(firstDataCell)

    const updatedValue = Number.parseInt(firstDataCell.textContent ?? '0', 10)
    expect(updatedValue).toBe(initialValue + 1)

    expect(screen.getByText(/60th percentile/i)).toBeInTheDocument()
    expect(container.querySelectorAll('tr')).toHaveLength(1 + 3 + 1)
  })

  it('highlights X nearest cells on hover', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProvider()

    const cells = screen.getAllByRole('cell')
    const hoveredCell = cells[0]

    await user.hover(hoveredCell)

    const highlighted = container.querySelectorAll('[data-highlighted]')
    expect(highlighted.length).toBe(2)
  })

  it('shows row percentages and heatmap on sum hover', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProvider()

    const sumCells = container.querySelectorAll('[data-sum-cell]')
    expect(sumCells.length).toBeGreaterThan(0)

    const firstSumCell = sumCells[0] as HTMLElement
    await user.hover(firstSumCell)

    const cells = screen.getAllByRole('cell')
    const percentageCells = cells.filter((cell) =>
      cell.textContent?.trim().endsWith('%'),
    )
    expect(percentageCells.length).toBeGreaterThan(0)

    const row = firstSumCell.closest('tr')
    const dataCellsInRow = row?.querySelectorAll('td[data-row]')
    expect(dataCellsInRow && dataCellsInRow.length).toBeGreaterThan(0)
  })

  it('adds and removes rows correctly', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    const initialRemoveButtons = screen.getAllByRole('button', { name: /Remove/i })
    expect(initialRemoveButtons.length).toBe(3)

    const addRowButton = screen.getByRole('button', { name: /Add row/i })
    await user.click(addRowButton)

    const afterAddRemoveButtons = screen.getAllByRole('button', { name: /Remove/i })
    expect(afterAddRemoveButtons.length).toBe(4)

    await user.click(afterAddRemoveButtons[0])

    const afterRemoveButtons = screen.getAllByRole('button', { name: /Remove/i })
    expect(afterRemoveButtons.length).toBe(3)
  })

  it('renders empty table when M=0 and N=0 without crashing', () => {
    render(
      <MatrixProvider initialRows={0} initialCols={0} initialNearestCount={0}>
        <MatrixTable />
      </MatrixProvider>,
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText(/Row SUM/i)).toBeInTheDocument()
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(1)
  })

  it('single cell (M=1, N=1): increment works', async () => {
    const user = userEvent.setup()
    render(
      <MatrixProvider initialRows={1} initialCols={1} initialNearestCount={0}>
        <MatrixTable />
      </MatrixProvider>,
    )

    const cells = screen.getAllByRole('cell')
    const dataCell = cells[0]
    const before = Number.parseInt(dataCell.textContent ?? '0', 10)
    await user.click(dataCell)
    const after = Number.parseInt(dataCell.textContent ?? '0', 10)
    expect(after).toBe(before + 1)
  })

  it('when X=0, hover does not highlight any cell', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <MatrixProvider initialRows={2} initialCols={2} initialNearestCount={0}>
        <MatrixTable />
      </MatrixProvider>,
    )

    const cells = screen.getAllByRole('cell')
    await user.hover(cells[0])

    const highlighted = container.querySelectorAll('[data-highlighted]')
    expect(highlighted.length).toBe(0)
  })
})
