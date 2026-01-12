import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getInitialTheme, applyTheme, toggleTheme } from '@/lib/theme'

// These tests define the expected behavior for "Dark Mode" feature

describe('Dark Mode Feature', () => {
  describe('getInitialTheme', () => {
    beforeEach(() => {
      localStorage.clear()
      // Reset matchMedia mock
      vi.unstubAllGlobals()
    })

    it('should return saved theme from localStorage if exists', () => {
      localStorage.setItem('theme', 'dark')
      const result = getInitialTheme()
      expect(result).toBe('dark')
    })

    it('should return "light" as default when no saved preference and no system preference', () => {
      vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })))
      
      const result = getInitialTheme()
      expect(result).toBe('light')
    })

    it('should respect system preference when no saved theme', () => {
      vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })))

      const result = getInitialTheme()
      expect(result).toBe('dark')
    })
  })

  describe('applyTheme', () => {
    beforeEach(() => {
      document.documentElement.classList.remove('dark', 'light')
      localStorage.clear()
    })

    it('should add "dark" class to html element for dark theme', () => {
      applyTheme('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove "dark" class for light theme', () => {
      document.documentElement.classList.add('dark')
      applyTheme('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should save theme to localStorage', () => {
      applyTheme('dark')
      expect(localStorage.getItem('theme')).toBe('dark')
    })
  })

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const result = toggleTheme('light')
      expect(result).toBe('dark')
    })

    it('should toggle from dark to light', () => {
      const result = toggleTheme('dark')
      expect(result).toBe('light')
    })
  })
})
