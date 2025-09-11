import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Activity, Bitcoin, Shield, AlertTriangle } from 'lucide-react'
import StatCard from '../components/StatCard'

describe('Enhanced StatCard Features', () => {
  it('renders with electric color theme and proper glow effects', () => {
    const { container } = render(
      <StatCard
        title="Total Transactions"
        value="2,156,420"
        icon={Activity}
        color="electric"
        change="+15.7%"
        trend="up"
      />
    )

    // Check for electric color classes
    expect(container.querySelector('.bg-electric-500\\/20')).toBeInTheDocument()
    expect(container.querySelector('.text-electric-400')).toBeInTheDocument()
    expect(container.querySelector('.border-electric-500\\/30')).toBeInTheDocument()
  })

  it('renders with bitcoin color theme', () => {
    const { container } = render(
      <StatCard
        title="Active Wallets"
        value="18,930"
        icon={Bitcoin}
        color="bitcoin"
        change="+8.4%"
        trend="up"
      />
    )

    expect(container.querySelector('.bg-bitcoin-500\\/20')).toBeInTheDocument()
    expect(container.querySelector('.text-bitcoin-400')).toBeInTheDocument()
  })

  it('renders with danger color theme for negative trends', () => {
    const { container } = render(
      <StatCard
        title="Suspicious Transactions"
        value="3,247"
        icon={AlertTriangle}
        color="danger"
        change="+3.2%"
        trend="up"
      />
    )

    expect(container.querySelector('.bg-danger-500\\/20')).toBeInTheDocument()
    expect(container.querySelector('.text-danger-400')).toBeInTheDocument()
  })

  it('renders with success color theme', () => {
    const { container } = render(
      <StatCard
        title="Anomalies Detected"
        value="47"
        icon={Shield}
        color="success"
        change="-12.1%"
        trend="down"
      />
    )

    expect(container.querySelector('.bg-success-500\\/20')).toBeInTheDocument()
    expect(container.querySelector('.text-success-400')).toBeInTheDocument()
  })

  it('has enhanced hover effects with scale transformation', () => {
    const { container } = render(
      <StatCard
        title="Test Card"
        value="1000"
        icon={Activity}
        color="electric"
      />
    )

    const card = container.querySelector('.glass-card')
    expect(card).toHaveClass('hover:scale-105', 'transition-all', 'duration-300', 'hover:shadow-glow')
  })

  it('renders trend indicators with proper icons', () => {
    const { container } = render(
      <StatCard
        title="Test Up Trend"
        value="1000"
        icon={Activity}
        color="success"
        change="+5.7%"
        trend="up"
      />
    )

    // Check trend elements using getAllByText to handle multiple matches
    const trendElements = screen.getAllByText((_, element) => {
      return Boolean(element?.textContent?.includes('↗') && element?.textContent?.includes('+5.7%'));
    })
    expect(trendElements.length).toBeGreaterThan(0)
    
    // Check trend colors
    expect(container.querySelector('.text-success-400')).toBeInTheDocument()
  })

  it('renders down trend with proper styling', () => {
    const { container } = render(
      <StatCard
        title="Test Down Trend"
        value="500"
        icon={Activity}
        color="danger"
        change="-2.3%"
        trend="down"
      />
    )

    // Check trend elements using getAllByText to handle multiple matches
    const trendElements = screen.getAllByText((_, element) => {
      return Boolean(element?.textContent?.includes('↘') && element?.textContent?.includes('-2.3%'));
    })
    expect(trendElements.length).toBeGreaterThan(0)
    
    // Check trend colors
    expect(container.querySelector('.text-danger-400')).toBeInTheDocument()
  })

  it('has proper gradient background effects', () => {
    const { container } = render(
      <StatCard
        title="Gradient Test"
        value="9999"
        icon={Activity}
        color="electric"
      />
    )

    // Check for gradient background elements
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
    expect(container.querySelector('.from-transparent')).toBeInTheDocument()
  })

  it('includes animated border effects on hover', () => {
    const { container } = render(
      <StatCard
        title="Border Animation Test"
        value="5555"
        icon={Activity}
        color="bitcoin"
      />
    )

    // Check for animated border elements
    expect(container.querySelector('.opacity-0.group-hover\\:opacity-100')).toBeInTheDocument()
    expect(container.querySelector('.transition-opacity')).toBeInTheDocument()
  })

  it('renders large value text with proper styling', () => {
    render(
      <StatCard
        title="Large Value"
        value="2,156,420"
        icon={Activity}
        color="electric"
      />
    )

    const valueElement = screen.getByText('2,156,420')
    expect(valueElement).toHaveClass('text-3xl', 'font-bold', 'text-dark-100', 'tracking-tight')
  })

  it('renders title with uppercase tracking', () => {
    render(
      <StatCard
        title="Uppercase Title"
        value="1000"
        icon={Activity}
        color="success"
      />
    )

    const titleElement = screen.getByText('Uppercase Title')
    expect(titleElement).toHaveClass('text-sm', 'font-medium', 'text-dark-400', 'tracking-wide', 'uppercase')
  })
})
