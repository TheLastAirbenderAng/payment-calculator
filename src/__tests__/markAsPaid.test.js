import { describe, it, expect } from 'vitest'
import { filterEntriesByStatus, calculateTotalOwed } from '@/lib/entries'

// These tests define the expected behavior for "Mark as Paid" feature

describe('Mark as Paid Feature', () => {
  describe('Entry data structure', () => {
    it('should have isPaid field defaulting to false', () => {
      const entry = {
        situation: 'Dinner',
        payerName: 'Juan',
        calculatedTotal: 500,
        isPaid: false,
      }
      expect(entry.isPaid).toBe(false)
    })

    it('should have paidAt timestamp when marked as paid', () => {
      const entry = {
        situation: 'Dinner',
        payerName: 'Juan',
        calculatedTotal: 500,
        isPaid: true,
        paidAt: new Date('2024-01-15'),
      }
      expect(entry.isPaid).toBe(true)
      expect(entry.paidAt).toBeInstanceOf(Date)
    })
  })

  describe('filterEntriesByStatus', () => {
    const mockEntries = [
      { id: '1', situation: 'Dinner', isPaid: false },
      { id: '2', situation: 'Movie', isPaid: true },
      { id: '3', situation: 'Groceries', isPaid: false },
      { id: '4', situation: 'Gas', isPaid: true },
    ]

    it('should return all entries when filter is "all"', () => {
      const result = filterEntriesByStatus(mockEntries, 'all')
      expect(result).toHaveLength(4)
    })

    it('should return only unpaid entries when filter is "unpaid"', () => {
      const result = filterEntriesByStatus(mockEntries, 'unpaid')
      expect(result).toHaveLength(2)
      expect(result.every(e => e.isPaid === false)).toBe(true)
    })

    it('should return only paid entries when filter is "paid"', () => {
      const result = filterEntriesByStatus(mockEntries, 'paid')
      expect(result).toHaveLength(2)
      expect(result.every(e => e.isPaid === true)).toBe(true)
    })

    it('should handle empty array', () => {
      const result = filterEntriesByStatus([], 'all')
      expect(result).toHaveLength(0)
    })

    it('should handle entries without isPaid field (legacy data)', () => {
      const legacyEntries = [
        { id: '1', situation: 'Old Entry' },
      ]
      const result = filterEntriesByStatus(legacyEntries, 'unpaid')
      expect(result).toHaveLength(1)
    })
  })

  describe('calculateTotalOwed', () => {
    const mockEntries = [
      { id: '1', calculatedTotal: 100, isPaid: false, currency: 'PHP' },
      { id: '2', calculatedTotal: 200, isPaid: true, currency: 'PHP' },
      { id: '3', calculatedTotal: 150, isPaid: false, currency: 'PHP' },
    ]

    it('should calculate total of unpaid entries only', () => {
      const result = calculateTotalOwed(mockEntries)
      expect(result).toBe(250)
    })

    it('should return 0 when all entries are paid', () => {
      const paidEntries = mockEntries.map(e => ({ ...e, isPaid: true }))
      const result = calculateTotalOwed(paidEntries)
      expect(result).toBe(0)
    })

    it('should return 0 for empty array', () => {
      const result = calculateTotalOwed([])
      expect(result).toBe(0)
    })
  })
})
