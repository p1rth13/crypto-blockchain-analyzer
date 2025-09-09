import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '../components/Dashboard'

// Mock child components
vi.mock('../components/TransactionChart', () => ({
  default: () => <div data-testid="transaction-chart">Enhanced TransactionChart with BTC Price</div>
}))

vi.mock('../components/AnomalyDetection', () => ({
  default: ({ detailed }: { detailed?: boolean }) => (
    <div data-testid="anomaly-detection">
      {detailed ? 'Advanced AI-powered threat detection and analysis' : 'Real-time threat monitoring'}
    </div>
  )
}))

vi.mock('../components/WalletAnalysis', () => ({
  default: () => <div data-testid="wallet-analysis">Deep dive into Bitcoin wallet behaviors</div>
}))

vi.mock('../components/StatCard', () => ({
  default: ({ title, value, change, trend, color }: any) => (
    <div data-testid="enhanced-stat-card" data-color={color}>
      <div>{title}</div>
      <div>{value}</div>
      {change && <div>{trend} {change}</div>}
    </div>
  )
}))

describe('Enhanced Dashboard Features', () => {
  it('renders with updated stats data', () => {
    render(<Dashboard />)

    // Check for new stat values
    expect(screen.getByText(/2156420|2,156,420/)).toBeInTheDocument() // Updated total transactions
    expect(screen.getByText(/3247|3,247/)).toBeInTheDocument() // Updated suspicious transactions
    expect(screen.getByText(/18930|18,930/)).toBeInTheDocument() // Updated active wallets
    expect(screen.getByText('47')).toBeInTheDocument() // Updated anomalies detected
  })

  it('displays enhanced header with new branding', () => {
    render(<Dashboard />)

    expect(screen.getByText('CryptoAnalysis')).toBeInTheDocument()
    expect(screen.getByText('Bitcoin Blockchain Intelligence Platform')).toBeInTheDocument() // Updated subtitle
  })

  it('renders stat cards with enhanced color themes', () => {
    const { container } = render(<Dashboard />)

    const statCards = container.querySelectorAll('[data-testid="enhanced-stat-card"]')
    expect(statCards).toHaveLength(4)

    // Check color themes
    expect(container.querySelector('[data-color="electric"]')).toBeInTheDocument()
    expect(container.querySelector('[data-color="danger"]')).toBeInTheDocument()
    expect(container.querySelector('[data-color="bitcoin"]')).toBeInTheDocument()
    expect(container.querySelector('[data-color="success"]')).toBeInTheDocument()
  })

  it('displays enhanced chart sections with new titles', () => {
    render(<Dashboard />)

    expect(screen.getByText('Transaction Volume Analysis')).toBeInTheDocument() // Updated from "Transaction Volume (Last 6 Months)"
    expect(screen.getByText('Last 6 months blockchain activity')).toBeInTheDocument() // New subtitle
    expect(screen.getByTestId('anomaly-detection')).toBeInTheDocument()
  })

  it('shows live indicator for real-time data', () => {
    render(<Dashboard />)

    expect(screen.getByText('LIVE')).toBeInTheDocument()
  })

  it('renders enhanced search with new placeholder', () => {
    render(<Dashboard />)

    const searchInput = screen.getByPlaceholderText('Search transactions, wallets, addresses...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays quick action buttons with proper titles', () => {
    render(<Dashboard />)

    expect(screen.getByTitle('Quick Scan')).toBeInTheDocument()
    expect(screen.getByTitle('Alerts')).toBeInTheDocument()
    expect(screen.getByTitle('Settings')).toBeInTheDocument()
  })

  it('shows enhanced anomaly detection section in dedicated tab', () => {
    render(<Dashboard />)

    // Click anomaly detection tab
    const anomalyTab = screen.getByRole('button', { name: /anomaly detection/i })
    fireEvent.click(anomalyTab)

    expect(screen.getByText('Anomaly Detection Engine')).toBeInTheDocument()
    // Use getAllByText since this text appears in both the component mock and the actual UI
    expect(screen.getAllByText('Advanced AI-powered threat detection and analysis')).toHaveLength(2)
  })

  it('shows enhanced wallet analysis section', () => {
    render(<Dashboard />)

    // Click wallet analysis tab  
    const walletTab = screen.getByRole('button', { name: /wallet analysis/i })
    fireEvent.click(walletTab)

    expect(screen.getByText('Wallet Intelligence Analysis')).toBeInTheDocument()
    expect(screen.getByText('Deep dive into Bitcoin wallet behaviors and patterns')).toBeInTheDocument()
  })

  it('displays stat tracking in wallet tab', () => {
    render(<Dashboard />)

    const walletTab = screen.getByRole('button', { name: /wallet analysis/i })
    fireEvent.click(walletTab)

    expect(screen.getAllByText((_, element) => {
      return Boolean(element?.textContent?.includes('Tracking') && 
        (element?.textContent?.includes('18,930') || element?.textContent?.includes('18930')))
    })[0]).toBeInTheDocument()
  })

  it('renders enhanced chart with multiple data series', () => {
    render(<Dashboard />)

    expect(screen.getByTestId('transaction-chart')).toBeInTheDocument()
    expect(screen.getByText('Enhanced TransactionChart with BTC Price')).toBeInTheDocument()
  })

  it('has proper tab active states with electric theme', () => {
    const { container } = render(<Dashboard />)

    // Overview should be active by default
    const activeTab = container.querySelector('.border-electric-500.text-electric-400')
    expect(activeTab).toBeInTheDocument()
  })

  it('displays status indicators', () => {
    render(<Dashboard />)

    // Click anomaly detection tab to see status indicator
    const anomalyTab = screen.getByRole('button', { name: /anomaly detection/i })
    fireEvent.click(anomalyTab)

    const statusIndicator = document.querySelector('.status-online')
    expect(statusIndicator).toBeInTheDocument()
  })

  it('shows view all button in overview sections', () => {
    render(<Dashboard />)

    const viewAllButton = screen.getByText('View All')
    expect(viewAllButton).toBeInTheDocument()
  })

  it('applies staggered animation delays to stat cards', () => {
    const { container } = render(<Dashboard />)

    const animatedElements = container.querySelectorAll('[style*="animation-delay"]')
    expect(animatedElements.length).toBeGreaterThan(0)
  })
})

describe('Enhanced Responsive Design', () => {
  it('has proper responsive grid layout', () => {
    const { container } = render(<Dashboard />)

    // Check for responsive grid classes
    const statsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4')
    expect(statsGrid).toBeInTheDocument()

    const chartsGrid = container.querySelector('.grid.grid-cols-1.xl\\:grid-cols-2')
    expect(chartsGrid).toBeInTheDocument()
  })

  it('has proper responsive padding and margins', () => {
    const { container } = render(<Dashboard />)

    const mainContainer = container.querySelector('.max-w-7xl.mx-auto.px-6.lg\\:px-8')
    expect(mainContainer).toBeInTheDocument()
  })
})
