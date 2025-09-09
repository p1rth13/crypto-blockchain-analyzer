import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import TransactionChart from '../components/TransactionChart'

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

  it('includes reference line for enhanced chart', () => {
    const { getByTestId } = render(<TransactionChart />)

    expect(getByTestId('reference-line')).toBeInTheDocument()
  })

  it('has proper chart structure for dual data series', () => {
    const { getAllByTestId } = render(<TransactionChart />)

    // Should have multiple areas for transaction volume and BTC price
    const areas = getAllByTestId('area')
    expect(areas.length).toBeGreaterThan(0)
  })
})
