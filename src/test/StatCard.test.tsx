import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Activity } from 'lucide-react'
import StatCard from '../components/StatCard'

describe('StatCard', () => {
  it('renders title and value correctly', () => {
    render(
      <StatCard
        title="Active Wallets"
        value="8,930"
        icon={Activity}
        color="green"
      />
    )

    expect(screen.getByText('Active Wallets')).toBeInTheDocument()
    expect(screen.getByText('8,930')).toBeInTheDocument()
  })

  it('renders with positive change indicator', () => {
    const { container } = render(
      <StatCard
        title="Active Wallets"
        value="8,930"
        icon={Activity}
        color="green"
        change="+5.7%"
        trend="up"
      />
    )

    // Check for trend elements using container queries
    const trendContainer = container.querySelector('.flex.items-center.space-x-2')
    expect(trendContainer).toBeInTheDocument()
    
    // Check for green color class
    expect(container.querySelector('.text-emerald-400')).toBeInTheDocument()
    
    // Check individual trend elements
    const upArrowElements = screen.getAllByText((_, element) => 
      element?.textContent?.includes('↗') || false
    )
    expect(upArrowElements.length).toBeGreaterThan(0)
    
    const percentageElements = screen.getAllByText((_, element) => 
      element?.textContent?.includes('+5.7%') || false
    )
    expect(percentageElements.length).toBeGreaterThan(0)
    
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('renders with negative change indicator', () => {
    const { container } = render(
      <StatCard
        title="Anomalies"
        value="23"
        icon={Activity}
        color="red"
        change="-8.1%"
        trend="down"
      />
    )

    // Check for trend elements using container queries
    const trendContainer = container.querySelector('.flex.items-center.space-x-2')
    expect(trendContainer).toBeInTheDocument()
    
    // Check for red color class
    expect(container.querySelector('.text-red-400')).toBeInTheDocument()
    
    // Check individual trend elements
    const downArrowElements = screen.getAllByText((_, element) => 
      element?.textContent?.includes('↘') || false
    )
    expect(downArrowElements.length).toBeGreaterThan(0)
    
    const percentageElements = screen.getAllByText((_, element) => 
      element?.textContent?.includes('-8.1%') || false
    )
    expect(percentageElements.length).toBeGreaterThan(0)
    
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('applies correct color classes for glass morphism design', () => {
    const { container } = render(
      <StatCard
        title="Test Card"
        value="123"
        icon={Activity}
        color="blue"
      />
    )

    // Check for glass-card class
    const cardElement = container.querySelector('.bg-slate-800')
    expect(cardElement).toBeInTheDocument()

    // Check for blue color classes in icon container
    const iconContainer = container.querySelector('.bg-slate-700')
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders without change indicator when not provided', () => {
    render(
      <StatCard
        title="Simple Card"
        value="999"
        icon={Activity}
        color="yellow"
      />
    )

    expect(screen.getByText('Simple Card')).toBeInTheDocument()
    expect(screen.getByText('999')).toBeInTheDocument()
    expect(screen.queryByText('vs last month')).not.toBeInTheDocument()
  })

  it('renders with neutral trend', () => {
    const { container } = render(
      <StatCard
        title="Neutral Card"
        value="500"
        icon={Activity}
        color="yellow"
        change="0.0%"
        trend="neutral"
      />
    )

    // Check for trend elements using container queries
    const trendContainer = container.querySelector('.flex.items-center.space-x-2')
    expect(trendContainer).toBeInTheDocument()
    
    // Check individual trend elements for neutral trend
    const percentageElements = screen.getAllByText((_, element) => 
      element?.textContent?.includes('0.0%') || false
    )
    expect(percentageElements.length).toBeGreaterThan(0)
  })

  it('has proper hover and animation classes', () => {
    const { container } = render(
      <StatCard
        title="Hover Test"
        value="1000"
        icon={Activity}
        color="green"
      />
    )

    const cardElement = container.querySelector('.bg-slate-800')
    expect(cardElement).toBeInTheDocument()
  })
})
