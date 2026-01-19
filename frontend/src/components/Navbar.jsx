import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Composant de navigation
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="nav-content">
        <div>
          <h2 style={{ margin: 0, color: '#007bff' }}>
            🏛️ Système d'Authentification
          </h2>
        </div>
        
        <div className="nav-links">
          {isAuthenticated() ? (
            <>
              <span style={{ marginRight: '1rem' }}>
                Bienvenue, <strong>{user?.email}</strong>
                <span className={`role-badge role-${user?.role}`} style={{ marginLeft: '0.5rem' }}>
                  {user?.role}
                </span>
              </span>
              <Link to="/dashboard" className="nav-link">
                Tableau de bord
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Connexion
              </Link>
              <Link to="/register" className="nav-link">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
