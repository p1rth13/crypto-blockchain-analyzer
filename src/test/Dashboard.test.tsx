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

vi.mock('../components/StatCard', () => ({
  default: ({ title, value }: { title: string; value: string }) => 
    <div data-testid="stat-card">{title}: {value}</div>
}))

describe('Dashboard', () => {
  it('renders header with title and search', () => {
    render(<Dashboard />)

    expect(screen.getByText('CryptoAnalysis')).toBeInTheDocument()
    expect(screen.getByText('Bitcoin Blockchain Analysis Platform')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search transactions, wallets...')).toBeInTheDocument()
  })

  it('renders navigation tabs', () => {
    render(<Dashboard />)

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Anomaly Detection')).toBeInTheDocument()
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

    expect(screen.getByText('Total Transactions: 1,56,420')).toBeInTheDocument()
    expect(screen.getByText('Suspicious Transactions: 1,247')).toBeInTheDocument()
    expect(screen.getByText('Active Wallets: 8,930')).toBeInTheDocument()
    expect(screen.getByText('Anomalies Detected: 23')).toBeInTheDocument()
  })

  it('handles search input', () => {
    render(<Dashboard />)

    const searchInput = screen.getByPlaceholderText('Search transactions, wallets...')
    fireEvent.change(searchInput, { target: { value: 'bitcoin' } })

    expect(searchInput).toHaveValue('bitcoin')
  })

  it('renders charts in overview tab', () => {
    render(<Dashboard />)

    expect(screen.getByText('Transaction Volume (Last 6 Months)')).toBeInTheDocument()
    expect(screen.getByText('Anomaly Detection Overview')).toBeInTheDocument()
    expect(screen.getByTestId('transaction-chart')).toBeInTheDocument()
  })
})
