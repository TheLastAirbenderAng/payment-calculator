import { describe, it, expect } from 'vitest'
import { calculateGuestTotal, validateGuestItems } from '../lib/guest'

describe('Guest Mode', () => {
  describe('calculateGuestTotal', () => {
    it('should calculate total from items only', () => {
      const items = [
        { name: 'Burger', price: 150, quantity: 2 },
        { name: 'Fries', price: 50, quantity: 1 },
      ]
      const result = calculateGuestTotal(items)
      expect(result.itemsSubtotal).toBe(350) // 150*2 + 50*1
      expect(result.total).toBe(350)
    })

    it('should calculate total with additional charges', () => {
      const items = [
        { name: 'Pizza', price: 500, quantity: 1 },
      ]
      const charges = {
        serviceCharge: 50,
        deliveryFee: 100,
        splitAmong: 2,
      }
      const result = calculateGuestTotal(items, charges)
      expect(result.itemsSubtotal).toBe(500)
      expect(result.chargesShare).toBe(75) // (50+100)/2
      expect(result.total).toBe(575) // 500 + 75
    })

    it('should handle empty items array', () => {
      const result = calculateGuestTotal([])
      expect(result.itemsSubtotal).toBe(0)
      expect(result.total).toBe(0)
    })

    it('should handle null/undefined charges', () => {
      const items = [{ name: 'Item', price: 100, quantity: 1 }]
      const result = calculateGuestTotal(items, null)
      expect(result.chargesShare).toBe(0)
      expect(result.total).toBe(100)
    })

    it('should handle zero quantity as 1', () => {
      const items = [{ name: 'Item', price: 100, quantity: 0 }]
      const result = calculateGuestTotal(items)
      // Zero quantity should be treated as 0 (invalid item)
      expect(result.itemsSubtotal).toBe(0)
    })

    it('should handle string prices and quantities', () => {
      const items = [{ name: 'Item', price: '100', quantity: '2' }]
      const result = calculateGuestTotal(items)
      expect(result.itemsSubtotal).toBe(200)
    })
  })

  describe('validateGuestItems', () => {
    it('should return true for valid items', () => {
      const items = [
        { name: 'Burger', price: 150, quantity: 1 },
      ]
      expect(validateGuestItems(items)).toBe(true)
    })

    it('should return false for empty items array', () => {
      expect(validateGuestItems([])).toBe(false)
    })

    it('should return false if all items have no name', () => {
      const items = [
        { name: '', price: 150, quantity: 1 },
        { name: '   ', price: 100, quantity: 1 },
      ]
      expect(validateGuestItems(items)).toBe(false)
    })

    it('should return false if all items have zero or negative price', () => {
      const items = [
        { name: 'Item', price: 0, quantity: 1 },
        { name: 'Item2', price: -10, quantity: 1 },
      ]
      expect(validateGuestItems(items)).toBe(false)
    })

    it('should return true if at least one item is valid', () => {
      const items = [
        { name: '', price: 150, quantity: 1 }, // invalid - no name
        { name: 'Burger', price: 150, quantity: 1 }, // valid
      ]
      expect(validateGuestItems(items)).toBe(true)
    })

    it('should handle string prices', () => {
      const items = [{ name: 'Item', price: '100', quantity: 1 }]
      expect(validateGuestItems(items)).toBe(true)
    })
  })
})
