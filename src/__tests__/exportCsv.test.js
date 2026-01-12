import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatEntryForCsv, entriesToCsv, downloadCsv } from '@/lib/export'

// These tests define the expected behavior for "Export CSV" feature

describe('Export CSV Feature', () => {
  describe('formatEntryForCsv', () => {
    it('should format a single entry correctly', () => {
      const entry = {
        id: '123',
        situation: 'Dinner @ Jollibee',
        payerName: 'Juan',
        calculatedTotal: 815,
        currency: 'PHP',
        isPaid: false,
        createdAt: { toDate: () => new Date('2024-01-15T10:30:00') },
        items: [
          { name: 'Chicken Joy', price: 200, quantity: 2 },
          { name: 'Rice', price: 50, quantity: 2 },
        ],
      }

      const result = formatEntryForCsv(entry)

      expect(result.date).toBe('2024-01-15')
      expect(result.situation).toBe('Dinner @ Jollibee')
      expect(result.payer).toBe('Juan')
      expect(result.total).toBe(815)
      expect(result.currency).toBe('PHP')
      expect(result.status).toBe('Unpaid')
      expect(result.items).toBe('Chicken Joy (2), Rice (2)')
    })

    it('should handle paid entries', () => {
      const entry = {
        situation: 'Movie',
        payerName: 'Maria',
        calculatedTotal: 500,
        currency: 'PHP',
        isPaid: true,
        createdAt: { toDate: () => new Date('2024-01-10') },
        items: [],
      }

      const result = formatEntryForCsv(entry)
      expect(result.status).toBe('Paid')
    })

    it('should handle missing items array', () => {
      const entry = {
        situation: 'Gas',
        payerName: 'Pedro',
        calculatedTotal: 1000,
        currency: 'PHP',
        isPaid: false,
        createdAt: { toDate: () => new Date('2024-01-12') },
      }

      const result = formatEntryForCsv(entry)
      expect(result.items).toBe('')
    })
  })

  describe('entriesToCsv', () => {
    it('should generate valid CSV string with headers', () => {
      const entries = [
        {
          situation: 'Dinner',
          payerName: 'Juan',
          calculatedTotal: 500,
          currency: 'PHP',
          isPaid: false,
          createdAt: { toDate: () => new Date('2024-01-15') },
          items: [{ name: 'Food', price: 500, quantity: 1 }],
        },
      ]

      const csv = entriesToCsv(entries)

      expect(csv).toContain('Date,Situation,Payer,Total,Currency,Status,Items')
      expect(csv).toContain('2024-01-15')
      expect(csv).toContain('Dinner')
      expect(csv).toContain('Juan')
      expect(csv).toContain('500')
    })

    it('should handle entries with commas in text (escape properly)', () => {
      const entries = [
        {
          situation: 'Dinner, Movie, and Snacks',
          payerName: 'Juan',
          calculatedTotal: 1000,
          currency: 'PHP',
          isPaid: false,
          createdAt: { toDate: () => new Date('2024-01-15') },
          items: [],
        },
      ]

      const csv = entriesToCsv(entries)
      expect(csv).toContain('"Dinner, Movie, and Snacks"')
    })

    it('should return only headers for empty entries', () => {
      const csv = entriesToCsv([])
      expect(csv).toBe('Date,Situation,Payer,Total,Currency,Status,Items')
    })
  })

  describe('downloadCsv', () => {
    beforeEach(() => {
      vi.restoreAllMocks()
    })

    it('should create download link with correct filename', () => {
      const csvContent = 'Date,Situation\n2024-01-15,Test'
      
      const mockUrl = 'blob:test-url'
      vi.stubGlobal('URL', {
        createObjectURL: vi.fn(() => mockUrl),
        revokeObjectURL: vi.fn(),
      })

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      }
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink)

      downloadCsv(csvContent, 'test-export.csv')

      expect(mockLink.download).toBe('test-export.csv')
      expect(mockLink.click).toHaveBeenCalled()
    })
  })
})
