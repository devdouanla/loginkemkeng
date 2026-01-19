import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Composant pour protéger les routes nécessitant une authentification
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Chargement...</div>
      </div>
    )
  }

  // Rediriger vers la page de login si non authentifié
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Afficher le composant protégé si authentifié
  return children
}

export default ProtectedRoute
