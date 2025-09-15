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

vi.mock('../components/EnhancedWalletAnalysis', () => ({
  default: () => <div data-testid="wallet-analysis">Enhanced wallet analysis with comprehensive tools</div>
}))

vi.mock('../components/HashAnalysis', () => ({
  default: () => <div data-testid="hash-analysis">Hash Analysis Component</div>
}))

vi.mock('../components/BlockAnalysis', () => ({
  default: () => <div data-testid="block-analysis">Block Analysis Component</div>
}))

vi.mock('../components/LedgerAnalysis', () => ({
  default: () => <div data-testid="ledger-analysis">Ledger Analysis Component</div>
}))

vi.mock('../components/LiveTransactionTracker', () => ({
  default: () => <div data-testid="live-transactions">Live Transaction Tracker</div>
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
  it('renders with updated stats data', async () => {
    render(<Dashboard />)

    // Wait for component to load (it has a loading state)
    await screen.findByText('CryptoGuard Analytics')

    // Check for new stat values (should be displayed via StatCard mocks)
    expect(screen.getByText('2,156,420')).toBeInTheDocument() // Formatted total transactions
    expect(screen.getByText('3,247')).toBeInTheDocument() // Formatted suspicious transactions  
    expect(screen.getByText('18,930')).toBeInTheDocument() // Formatted active wallets
    expect(screen.getByText('47')).toBeInTheDocument() // Updated anomalies detected
  })

  it('displays enhanced header with new branding', () => {
    render(<Dashboard />)

    expect(screen.getByText('CryptoGuard Analytics')).toBeInTheDocument()
    expect(screen.getByText('Advanced Blockchain Analysis & Security')).toBeInTheDocument() // Updated subtitle
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

    expect(screen.getAllByText('LIVE')).toHaveLength(2) // Multiple LIVE indicators are expected
  })

  it('renders enhanced navigation without search', () => {
    render(<Dashboard />)

    // Dashboard doesn't have a search input in current implementation
    expect(screen.getByRole('navigation')).toBeInTheDocument()
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

    expect(screen.getByText('Enhanced Wallet Analysis')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive blockchain wallet investigation tools')).toBeInTheDocument()
  })

  it('displays enhanced wallet analysis in wallet tab', () => {
    render(<Dashboard />)

    const walletTab = screen.getByRole('button', { name: /wallet analysis/i })
    fireEvent.click(walletTab)

    // Check for wallet analysis component (mocked component should be present)
    expect(screen.getByTestId('wallet-analysis')).toBeInTheDocument()
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
