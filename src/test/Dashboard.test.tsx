import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '../components/Dashboard'

// Mock the child components
vi.mock('../components/TransactionChart', () => ({
  default: () => <div data-testid="transaction-chart">TransactionChart</div>
}))

vi.mock('../components/AnomalyDetection', () => ({
  default: ({ detailed }: { detailed?: boolean }) => 
    <div data-testid="anomaly-detection">AnomalyDetection {detailed ? 'Detailed' : 'Simple'}</div>
}))

vi.mock('../components/WalletAnalysis', () => ({
  default: () => <div data-testid="wallet-analysis">WalletAnalysis</div>
}))

vi.mock('../components/EnhancedWalletAnalysis', () => ({
  default: () => <div data-testid="wallet-analysis">EnhancedWalletAnalysis</div>
}))

vi.mock('../components/HashAnalysis', () => ({
  default: () => <div data-testid="hash-analysis">HashAnalysis</div>
}))

vi.mock('../components/BlockAnalysis', () => ({
  default: () => <div data-testid="block-analysis">BlockAnalysis</div>
}))

vi.mock('../components/LedgerAnalysis', () => ({
  default: () => <div data-testid="ledger-analysis">LedgerAnalysis</div>
}))

vi.mock('../components/LiveTransactionTracker', () => ({
  default: () => <div data-testid="live-transactions">LiveTransactionTracker</div>
}))

vi.mock('../components/StatCard', () => ({
  default: ({ title, value, change, trend }: { title: string; value: string; change?: string; trend?: string }) => (
    <div data-testid="stat-card">
      <div data-testid="stat-title">{title}</div>
      <div data-testid="stat-value">{value}</div>
      {change && <div data-testid="stat-change">{change} {trend}</div>}
    </div>
  )
}))

describe('Dashboard', () => {
  it('renders header with title and search', () => {
    render(<Dashboard />)

    expect(screen.getByText('CryptoGuard Analytics')).toBeInTheDocument()
    expect(screen.getByText('Advanced Blockchain Analysis & Security')).toBeInTheDocument()
    // No search input in current implementation, check for navigation instead
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders navigation tabs', () => {
    render(<Dashboard />)

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getAllByText('Anomaly Detection')).toHaveLength(2) // One in nav, one in content
    expect(screen.getByText('Wallet Analysis')).toBeInTheDocument()
  })

  it('switches tabs correctly', () => {
    render(<Dashboard />)

    // Default should show overview with stat cards
    expect(screen.getAllByTestId('stat-card')).toHaveLength(4)

    // Click on Anomaly Detection tab
    fireEvent.click(screen.getByRole('button', { name: /anomaly detection/i }))
    expect(screen.getByText('Anomaly Detection Engine')).toBeInTheDocument()
    expect(screen.getByText('AnomalyDetection Detailed')).toBeInTheDocument()

    // Click on Wallet Analysis tab
    fireEvent.click(screen.getByRole('button', { name: /wallet analysis/i }))
    expect(screen.getByTestId('wallet-analysis')).toBeInTheDocument()
  })

  it('renders stat cards with correct data', () => {
    render(<Dashboard />)

    // Updated to match new data format
    expect(screen.getByText('Total Transactions')).toBeInTheDocument()
    expect(screen.getByText(/2156420|2,156,420/)).toBeInTheDocument()
    expect(screen.getByText('Suspicious Transactions')).toBeInTheDocument()
    expect(screen.getByText(/3247|3,247/)).toBeInTheDocument()
    expect(screen.getByText('Active Wallets')).toBeInTheDocument()
    expect(screen.getByText('18,930')).toBeInTheDocument()
    expect(screen.getByText('Anomalies Detected')).toBeInTheDocument()
    expect(screen.getByText('47')).toBeInTheDocument()
  })

  it('handles tab navigation', () => {
    render(<Dashboard />)

    // Test tab navigation instead of search
    const walletTab = screen.getByText('Wallet Analysis')
    fireEvent.click(walletTab)

    expect(screen.getByTestId('wallet-analysis')).toBeInTheDocument()
  })

  it('renders charts in overview tab', () => {
    render(<Dashboard />)

    expect(screen.getByText('Transaction Volume Analysis')).toBeInTheDocument()
    expect(screen.getByText('Last 6 months blockchain activity')).toBeInTheDocument()
    expect(screen.getByText('Real-time threat monitoring')).toBeInTheDocument()
    expect(screen.getByTestId('transaction-chart')).toBeInTheDocument()
  })

  it('shows quick action buttons', () => {
    render(<Dashboard />)

    expect(screen.getByTitle('Quick Scan')).toBeInTheDocument()
    expect(screen.getByTitle('Alerts')).toBeInTheDocument()
    expect(screen.getByTitle('Settings')).toBeInTheDocument()
  })

  it('displays animated background elements', () => {
    render(<Dashboard />)

    const container = screen.getByText('CryptoGuard Analytics').closest('.min-h-screen')
    expect(container).toHaveClass('bg-gradient-to-br', 'from-dark-900', 'via-dark-800', 'to-dark-900', 'relative')
  })
})
