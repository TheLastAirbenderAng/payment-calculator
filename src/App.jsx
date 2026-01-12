import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/hooks/useAuth"
import { ThemeProvider } from "@/hooks/useTheme"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"
import Login from "@/pages/Login"
import Calculator from "@/pages/Calculator"
import GuestCalculator from "@/pages/GuestCalculator"
import History from "@/pages/History"
import HistoryDetail from "@/pages/HistoryDetail"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename="/payment-calculator">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/guest" element={<GuestCalculator />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/:id"
              element={
                <ProtectedRoute>
                  <HistoryDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
