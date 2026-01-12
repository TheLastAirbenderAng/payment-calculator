import { createContext, useContext, useState, useEffect } from "react"
import { getInitialTheme, applyTheme, toggleTheme as toggle } from "@/lib/theme"

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getInitialTheme())

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      const savedTheme = localStorage.getItem("theme")
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme((current) => toggle(current))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
