import { describe, it, expect } from 'vitest'
import { formatCurrency, cn, USD_TO_PHP_RATE } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats PHP currency correctly', () => {
    const result = formatCurrency(1234.56, 'PHP')
    expect(result).toContain('1,234.56')
  })

  it('formats USD currency correctly', () => {
    const result = formatCurrency(1234.56, 'USD')
    expect(result).toContain('1,234.56')
  })

  it('handles zero correctly', () => {
    const result = formatCurrency(0, 'PHP')
    expect(result).toContain('0.00')
  })

  it('handles negative numbers correctly', () => {
    const result = formatCurrency(-500, 'PHP')
    expect(result).toContain('500.00')
  })
})

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('px-4', 'py-2', 'bg-red-500')
    expect(result).toBe('px-4 py-2 bg-red-500')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base', isActive && 'active')
    expect(result).toBe('base active')
  })

  it('handles falsy values', () => {
    const result = cn('base', false, null, undefined, 'end')
    expect(result).toBe('base end')
  })

  it('merges tailwind classes correctly', () => {
    const result = cn('px-4 py-2', 'px-6')
    expect(result).toBe('py-2 px-6')
  })
})

describe('USD_TO_PHP_RATE', () => {
  it('is a reasonable exchange rate', () => {
    expect(USD_TO_PHP_RATE).toBeGreaterThan(40)
    expect(USD_TO_PHP_RATE).toBeLessThan(70)
  })
})
