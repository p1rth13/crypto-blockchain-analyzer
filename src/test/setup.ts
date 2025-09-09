import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Global test setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock ResizeObserver
Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
})

// Mock recharts with proper React components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => React.createElement('div', { 'data-testid': 'responsive-container' }, children),
  AreaChart: ({ children }: any) => React.createElement('div', { 'data-testid': 'area-chart' }, children),
  Area: ({ dataKey }: any) => React.createElement('div', { 'data-testid': 'area', 'data-key': dataKey }),
  XAxis: () => React.createElement('div', { 'data-testid': 'x-axis' }),
  YAxis: () => React.createElement('div', { 'data-testid': 'y-axis' }),
  CartesianGrid: () => React.createElement('div', { 'data-testid': 'cartesian-grid' }),
  Tooltip: () => React.createElement('div', { 'data-testid': 'tooltip' }),
  Legend: () => React.createElement('div', { 'data-testid': 'legend' }),
  ReferenceLine: ({ y, stroke }: any) => React.createElement('div', { 
    'data-testid': 'reference-line', 
    'data-y': y, 
    'data-stroke': stroke 
  }),
  Line: () => React.createElement('div', { 'data-testid': 'line' }),
  LineChart: ({ children }: any) => React.createElement('div', { 'data-testid': 'line-chart' }, children),
}))
