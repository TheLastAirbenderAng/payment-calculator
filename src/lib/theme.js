/**
 * Get the initial theme based on saved preference or system setting
 * @returns {string} 'light' | 'dark'
 */
export function getInitialTheme() {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }

  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      return 'dark'
    }
  }

  // Default to light
  return 'light'
}

/**
 * Apply theme to the document
 * @param {string} theme - 'light' | 'dark'
 */
export function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Save to localStorage
  localStorage.setItem('theme', theme)
}

/**
 * Toggle between light and dark theme
 * @param {string} currentTheme - Current theme
 * @returns {string} New theme
 */
export function toggleTheme(currentTheme) {
  return currentTheme === 'light' ? 'dark' : 'light'
}
