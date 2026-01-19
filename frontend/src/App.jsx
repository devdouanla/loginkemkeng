import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Composant principal de l'application
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            {/* Route publique - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Route publique - Register */}
            <Route path="/register" element={<Register />} />
            
            {/* Route protégée - Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirection par défaut vers le login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App
