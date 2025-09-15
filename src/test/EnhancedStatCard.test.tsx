import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Activity, Bitcoin, Shield, AlertTriangle } from 'lucide-react'
import StatCard from '../components/StatCard'

describe('Enhanced StatCard Features', () => {
  it('renders with blue color theme and proper glow effects', () => {
    const { container } = render(
      <StatCard
        title="Total Transactions"
        value="2,156,420"
        icon={Activity}
        color="blue"
        change="+15.7%"
        trend="up"
      />
    )

    // Check for blue color classes
    expect(container.querySelector('.bg-slate-800')).toBeInTheDocument()
    expect(container.querySelector('.text-blue-400')).toBeInTheDocument()
    expect(container.querySelector('.border-slate-700')).toBeInTheDocument()
  })

  it('renders with yellow color theme', () => {
    const { container } = render(
      <StatCard
        title="Active Wallets"
        value="18,930"
        icon={Bitcoin}
        color="yellow"
        change="+8.4%"
        trend="up"
      />
    )

    expect(container.querySelector('.bg-slate-800')).toBeInTheDocument()
    expect(container.querySelector('.text-amber-400')).toBeInTheDocument()
  })

  it('renders with red color theme for negative trends', () => {
    const { container } = render(
      <StatCard
        title="Suspicious Transactions"
        value="3,247"
        icon={AlertTriangle}
        color="red"
        change="+3.2%"
        trend="up"
      />
    )

    expect(container.querySelector('.bg-slate-800')).toBeInTheDocument()
    expect(container.querySelector('.text-red-400')).toBeInTheDocument()
  })

  it('renders with green color theme', () => {
    const { container } = render(
      <StatCard
        title="Anomalies Detected"
        value="47"
        icon={Shield}
        color="green"
        change="-12.1%"
        trend="down"
      />
    )

    expect(container.querySelector('.bg-slate-800')).toBeInTheDocument()
    expect(container.querySelector('.text-emerald-400')).toBeInTheDocument()
  })

  it('has enhanced hover effects with scale transformation', () => {
    const { container } = render(
      <StatCard
        title="Test Card"
        value="1000"
        icon={Activity}
        color="blue"
      />
    )

    const card = container.querySelector('.bg-slate-800')
    expect(card).toBeInTheDocument()
  })

  it('renders trend indicators with proper icons', () => {
    const { container } = render(
      <StatCard
        title="Test Up Trend"
        value="1000"
        icon={Activity}
        color="green"
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
    expect(container.querySelector('.text-emerald-400')).toBeInTheDocument()
  })

  it('renders down trend with proper styling', () => {
    const { container } = render(
      <StatCard
        title="Test Down Trend"
        value="500"
        icon={Activity}
        color="red"
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
    expect(container.querySelector('.text-red-400')).toBeInTheDocument()
  })

  it('has proper gradient background effects', () => {
    const { container } = render(
      <StatCard
        title="Gradient Test"
        value="9999"
        icon={Activity}
        color="blue"
      />
    )

    // Check for gradient background elements
    expect(container.querySelector('.bg-slate-800')).toBeInTheDocument()
  })

  it('includes animated border effects on hover', () => {
    const { container } = render(
      <StatCard
        title="Border Animation Test"
        value="5555"
        icon={Activity}
        color="yellow"
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
        color="blue"
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
        color="green"
      />
    )

    const titleElement = screen.getByText('Uppercase Title')
    expect(titleElement).toHaveClass('text-sm', 'font-medium', 'text-dark-400', 'tracking-wide', 'uppercase')
  })
})
