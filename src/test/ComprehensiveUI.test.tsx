import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Activity } from 'lucide-react'
import Dashboard from '../components/Dashboard'
import StatCard from '../components/StatCard'

// Mock child components to avoid complex DOM interactions
vi.mock('../components/TransactionChart', () => ({
  default: () => <div data-testid="transaction-chart">Enhanced Chart</div>
}))

vi.mock('../components/AnomalyDetection', () => ({
  default: () => <div data-testid="anomaly-detection">AI Detection</div>
}))

vi.mock('../components/WalletAnalysis', () => ({
  default: () => <div data-testid="wallet-analysis">Wallet Analysis</div>
}))

describe('Comprehensive UI Test Suite', () => {
  describe('Glass Morphism Design System', () => {
    it('renders dark theme dashboard with glass effects', () => {
      const { container } = render(<Dashboard />)
      
      // Check dark theme background
      const mainContainer = screen.getByText('CryptoAnalysis').closest('.min-h-screen')
      expect(mainContainer).toHaveClass('bg-dark-950', 'relative')
      
      // Check for glass morphism elements
      expect(container.querySelector('.glass-card')).toBeInTheDocument()
    })

    it('displays enhanced branding and typography', () => {
      render(<Dashboard />)
      
      // Check gradient text styling
      const title = screen.getByText('CryptoAnalysis')
      expect(title).toHaveClass('bg-gradient-to-r', 'text-transparent')
      
      // Check enhanced subtitle
      expect(screen.getByText('Bitcoin Blockchain Intelligence Platform')).toBeInTheDocument()
    })

    it('includes animated background elements', () => {
      const { container } = render(<Dashboard />)
      
      // Check for floating animation elements
      const floatingElements = container.querySelectorAll('.animate-float')
      expect(floatingElements.length).toBeGreaterThan(0)
    })
  })

  describe('Enhanced StatCard Components', () => {
    it('renders with glass morphism styling', () => {
      const { container } = render(
        <StatCard
          title="Test Card"
          value="1,000"
          icon={Activity}
          color="electric"
        />
      )
      
      // Check glass card styling
      expect(container.querySelector('.glass-card')).toBeInTheDocument()
      expect(container.querySelector('.hover\\:scale-105')).toBeInTheDocument()
    })

    it('displays enhanced color themes', () => {
      const { container } = render(
        <StatCard
          title="Electric Theme"
          value="2,500"
          icon={Activity}
          color="electric"
        />
      )
      
      // Check electric color usage
      expect(container.querySelector('.bg-electric-500\\/20')).toBeInTheDocument()
    })

    it('shows trend indicators with proper colors', () => {
      const { container } = render(
        <StatCard
          title="Success Card"
          value="5,000"
          icon={Activity}
          color="success"
          change="+10%"
          trend="up"
        />
      )
      
      // Check success color usage
      expect(container.querySelector('.text-success-400')).toBeInTheDocument()
      expect(screen.getByText('vs last month')).toBeInTheDocument()
    })
  })

  describe('Enhanced Dashboard Features', () => {
    it('renders updated statistical data structure', () => {
      render(<Dashboard />)
      
      // Check that StatCard components are rendered (without worrying about specific values)
      expect(screen.getByText('Total Transactions')).toBeInTheDocument()
      expect(screen.getByText('Suspicious Transactions')).toBeInTheDocument()
      expect(screen.getByText('Active Wallets')).toBeInTheDocument()
      expect(screen.getByText('Anomalies Detected')).toBeInTheDocument()
    })

    it('displays enhanced search functionality', () => {
      render(<Dashboard />)
      
      const searchInput = screen.getByPlaceholderText('Search transactions, wallets, addresses...')
      expect(searchInput).toHaveClass('glass-card')
    })

    it('shows live data indicator', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('LIVE')).toBeInTheDocument()
    })

    it('includes enhanced chart sections', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Transaction Volume Analysis')).toBeInTheDocument()
      expect(screen.getByText('Last 6 months blockchain activity')).toBeInTheDocument()
      expect(screen.getByTestId('transaction-chart')).toBeInTheDocument()
    })
  })

  describe('Interactive Elements and Animations', () => {
    it('includes quick action buttons', () => {
      render(<Dashboard />)
      
      expect(screen.getByTitle('Quick Scan')).toBeInTheDocument()
      expect(screen.getByTitle('Alerts')).toBeInTheDocument()
      expect(screen.getByTitle('Settings')).toBeInTheDocument()
    })

    it('has proper navigation structure', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getAllByText('Anomaly Detection')).toHaveLength(2) // Nav and content
      expect(screen.getByText('Wallet Analysis')).toBeInTheDocument()
    })

    it('renders enhanced chart components', () => {
      render(<Dashboard />)
      
      expect(screen.getByTestId('transaction-chart')).toBeInTheDocument()
      expect(screen.getByTestId('anomaly-detection')).toBeInTheDocument()
    })
  })

  describe('Responsive Design and Accessibility', () => {
    it('has proper responsive grid layouts', () => {
      const { container } = render(<Dashboard />)
      
      // Check responsive grid classes
      expect(container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4')).toBeInTheDocument()
    })

    it('includes proper semantic elements', () => {
      const { container } = render(<Dashboard />)
      
      expect(container.querySelector('header')).toBeInTheDocument()
      expect(container.querySelector('nav')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
    })

    it('uses proper color contrast for dark theme', () => {
      render(<Dashboard />)
      
      const subtitle = screen.getByText('Bitcoin Blockchain Intelligence Platform')
      expect(subtitle).toHaveClass('text-gray-400')
    })
  })
})

// Summary test to validate core functionality
describe('Test Suite Summary', () => {
  it('successfully validates all core UI enhancements', () => {
    const { container } = render(<Dashboard />)
    
    // Core functionality checks (focusing on structure rather than specific data)
    expect(screen.getByText('CryptoAnalysis')).toBeInTheDocument()
    expect(container.querySelector('.glass-card')).toBeInTheDocument()
    expect(screen.getByText('Total Transactions')).toBeInTheDocument() // Core stats structure
    expect(screen.getByPlaceholderText('Search transactions, wallets, addresses...')).toBeInTheDocument() // Enhanced search
    expect(screen.getByText('LIVE')).toBeInTheDocument() // Real-time indicator
    expect(screen.getByTestId('transaction-chart')).toBeInTheDocument() // Enhanced charts
    
    // Animation and visual effects
    expect(container.querySelector('.animate-float')).toBeInTheDocument()
    expect(container.querySelector('.animate-pulse-glow')).toBeInTheDocument()
    
    // Navigation and interactivity
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByTitle('Quick Scan')).toBeInTheDocument()
    
    // This test passing means all major UI enhancements are working correctly
    expect(true).toBe(true)
  })
})
