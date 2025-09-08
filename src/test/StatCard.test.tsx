import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '../components/StatCard'
import { Activity } from 'lucide-react'

describe('StatCard', () => {
  it('renders with correct title and value', () => {
    render(
      <StatCard
        title="Total Transactions"
        value="156,420"
        icon={Activity}
        color="blue"
      />
    )

    expect(screen.getByText('Total Transactions')).toBeInTheDocument()
    expect(screen.getByText('156,420')).toBeInTheDocument()
  })

  it('renders with positive change indicator', () => {
    render(
      <StatCard
        title="Active Wallets"
        value="8,930"
        icon={Activity}
        color="green"
        change="+5.7%"
      />
    )

    const changeElement = screen.getByText('+5.7% from last month')
    expect(changeElement).toBeInTheDocument()
    expect(changeElement).toHaveClass('text-green-600')
  })

  it('renders with negative change indicator', () => {
    render(
      <StatCard
        title="Anomalies"
        value="23"
        icon={Activity}
        color="red"
        change="-8.1%"
      />
    )

    const changeElement = screen.getByText('-8.1% from last month')
    expect(changeElement).toBeInTheDocument()
    expect(changeElement).toHaveClass('text-red-600')
  })

  it('applies correct color classes', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value="100"
        icon={Activity}
        color="purple"
      />
    )

    const iconContainer = container.querySelector('.bg-purple-100.text-purple-600')
    expect(iconContainer).toBeInTheDocument()
  })
})
