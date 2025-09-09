import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

// Mock the Dashboard component
vi.mock('../components/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard Component</div>
}))

describe('App', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('dashboard')).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    const { container } = render(<App />)
    const appDiv = container.firstChild as HTMLElement
    expect(appDiv).toHaveClass('App')
  })
})
