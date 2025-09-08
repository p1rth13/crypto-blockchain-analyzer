import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import TransactionChart from '../components/TransactionChart'

// Mock Recharts components
vi.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}))

describe('TransactionChart', () => {
  it('renders chart components', () => {
    const { getByTestId } = render(<TransactionChart />)

    expect(getByTestId('responsive-container')).toBeInTheDocument()
    expect(getByTestId('area-chart')).toBeInTheDocument()
    expect(getByTestId('x-axis')).toBeInTheDocument()
    expect(getByTestId('y-axis')).toBeInTheDocument()
    expect(getByTestId('cartesian-grid')).toBeInTheDocument()
    expect(getByTestId('tooltip')).toBeInTheDocument()
  })

  it('renders without errors', () => {
    expect(() => render(<TransactionChart />)).not.toThrow()
  })
})
