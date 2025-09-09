import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TransactionChart from '../components/TransactionChart'

describe('Enhanced TransactionChart Features', () => {
  it('renders enhanced chart with dual data series', () => {
    const { getByTestId, getAllByTestId } = render(<TransactionChart />)

    expect(getByTestId('responsive-container')).toBeInTheDocument()
    expect(getByTestId('area-chart')).toBeInTheDocument()
    
    // Should have multiple areas for different data series
    const areas = getAllByTestId('area')
    expect(areas.length).toBeGreaterThan(1) // Transaction volume + BTC price
  })

  it('includes reference line for average values', () => {
    const { getByTestId } = render(<TransactionChart />)

    const referenceLine = getByTestId('reference-line')
    expect(referenceLine).toBeInTheDocument()
    expect(referenceLine).toHaveAttribute('data-y', '580000')
    expect(referenceLine).toHaveAttribute('data-stroke', '#64748b')
  })

  it('renders chart axes and grid', () => {
    const { getByTestId } = render(<TransactionChart />)

    expect(getByTestId('x-axis')).toBeInTheDocument()
    expect(getByTestId('y-axis')).toBeInTheDocument()
    expect(getByTestId('cartesian-grid')).toBeInTheDocument()
  })

  it('includes tooltip for interactive data display', () => {
    const { getByTestId } = render(<TransactionChart />)

    expect(getByTestId('tooltip')).toBeInTheDocument()
  })

  it('includes legend for data series identification', () => {
    const { container } = render(<TransactionChart />)

    // Check for legend items by their content instead of testid
    expect(screen.getByText('Total Transactions')).toBeInTheDocument()
    expect(screen.getByText('Suspicious')).toBeInTheDocument() 
    expect(screen.getByText('BTC Price')).toBeInTheDocument()
    
    // Check for colored indicators
    expect(container.querySelector('.bg-electric-500')).toBeInTheDocument()
    expect(container.querySelector('.bg-danger-500')).toBeInTheDocument()
    expect(container.querySelector('.bg-bitcoin-500')).toBeInTheDocument()
  })

  it('renders without errors', () => {
    expect(() => render(<TransactionChart />)).not.toThrow()
  })

  it('has proper responsive container structure', () => {
    const { getByTestId } = render(<TransactionChart />)

    const container = getByTestId('responsive-container')
    const chart = getByTestId('area-chart')
    
    expect(container).toContainElement(chart)
  })

  it('supports enhanced visualization features', () => {
    const { container } = render(<TransactionChart />)

    // The component should render without throwing errors
    // and contain the expected chart structure
    expect(container.firstChild).toBeTruthy()
  })
})
