import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Création du contexte d'authentification
const AuthContext = createContext()

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

// Provider du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (err) {
        console.error('Erreur lors de la lecture du localStorage:', err)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setError(null)
      const response = await axios.post('/api/auth/register', userData)
      
      if (response.data.user) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de l\'inscription'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setError(null)
      const response = await axios.post('/api/auth/login', { email, password })
      
      if (response.data.user) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Email ou mot de passe incorrect'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setError(null)
  }

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    return user !== null
  }

  // Obtenir le rôle de l'utilisateur
  const getUserRole = () => {
    return user?.role || null
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return user?.role === role
  }

  // Valeur fournies par le contexte
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
