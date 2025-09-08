import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatPercentage,
  calculatePercentageChange,
  formatBitcoinAddress,
  formatDate,
  getRiskLevel,
  getRiskColor
} from '../utils/formatters'

describe('Formatters Utilities', () => {
  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1234)).toBe('1,234')
      expect(formatNumber(1234567)).toBe('12,34,567') // Based on locale formatting
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('formatPercentage', () => {
    it('formats positive percentages with + sign', () => {
      expect(formatPercentage(5.67)).toBe('+5.7%')
      expect(formatPercentage(0)).toBe('+0.0%')
    })

    it('formats negative percentages without extra sign', () => {
      expect(formatPercentage(-8.14)).toBe('-8.1%')
    })
  })

  describe('calculatePercentageChange', () => {
    it('calculates positive percentage change', () => {
      expect(calculatePercentageChange(120, 100)).toBe(20)
    })

    it('calculates negative percentage change', () => {
      expect(calculatePercentageChange(80, 100)).toBe(-20)
    })

    it('returns 0 when previous value is 0', () => {
      expect(calculatePercentageChange(100, 0)).toBe(0)
    })

    it('returns 0 when values are equal', () => {
      expect(calculatePercentageChange(100, 100)).toBe(0)
    })
  })

  describe('formatBitcoinAddress', () => {
    it('formats long addresses with ellipsis', () => {
      const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      expect(formatBitcoinAddress(address)).toBe('1A1zP1...vfNa')
    })

    it('returns short addresses as-is', () => {
      const shortAddress = '123456'
      expect(formatBitcoinAddress(shortAddress)).toBe('123456')
    })
  })

  describe('formatDate', () => {
    it('formats timestamp to readable date', () => {
      // Mock timestamp for September 7, 2025, 12:00 PM
      const timestamp = 1757404800 // This would be the timestamp for that date
      const formatted = formatDate(timestamp)
      expect(formatted).toMatch(/Sep|Sept/) // Should contain month abbreviation
      expect(formatted).toMatch(/\d{4}/) // Should contain year
    })
  })

  describe('getRiskLevel', () => {
    it('returns correct risk levels', () => {
      expect(getRiskLevel(0.1)).toBe('low')
      expect(getRiskLevel(0.5)).toBe('medium')
      expect(getRiskLevel(0.7)).toBe('high')
      expect(getRiskLevel(0.9)).toBe('critical')
    })

    it('handles boundary values correctly', () => {
      expect(getRiskLevel(0.3)).toBe('medium')
      expect(getRiskLevel(0.6)).toBe('high')
      expect(getRiskLevel(0.8)).toBe('critical')
    })
  })

  describe('getRiskColor', () => {
    it('returns correct color classes', () => {
      expect(getRiskColor('low')).toBe('text-green-600 bg-green-100')
      expect(getRiskColor('medium')).toBe('text-yellow-600 bg-yellow-100')
      expect(getRiskColor('high')).toBe('text-orange-600 bg-orange-100')
      expect(getRiskColor('critical')).toBe('text-red-600 bg-red-100')
    })
  })
})
