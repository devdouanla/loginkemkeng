import React from 'react'
import { useAuth } from '../contexts/AuthContext'

// Page du tableau de bord
const Dashboard = () => {
  const { user, logout, hasRole } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  // Contenu spécifique selon le rôle
  const renderRoleSpecificContent = () => {
    if (hasRole('etudiant')) {
      return (
        <div style={{ backgroundColor: '#e3f2fd', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#1976d2', margin: '0 0 1rem 0' }}>
            👨‍🎓 Espace Étudiant
          </h3>
          <div style={{ lineHeight: '1.6' }}>
            <p><strong>Bienvenue dans votre espace étudiant !</strong></p>
           
          </div>
        </div>
      )
    }

    if (hasRole('vendeur')) {
      return (
        <div style={{ backgroundColor: '#f3e5f5', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#7b1fa2', margin: '0 0 1rem 0' }}>
            🏪 Espace Vendeur
          </h3>
          <div style={{ lineHeight: '1.6' }}>
            <p><strong>Bienvenue dans votre espace vendeur !</strong></p>
           
          </div>
        </div>
      )
    }

    if (hasRole('admin')) {
      return (
        <div style={{ backgroundColor: '#ffebee', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#c62828', margin: '0 0 1rem 0' }}>
             Espace Administrateur
          </h3>
          <div style={{ lineHeight: '1.6' }}>
            <p><strong>Bienvenue dans votre espace administrateur !</strong></p>
           
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 style={{ margin: 0, color: '#333' }}>
          📊 Tableau de Bord
        </h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
          Bienvenue, {user?.email}
        </p>
      </div>

      {/* Informations utilisateur */}
      <div className="user-info">
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
          👤 Informations du compte
        </h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div><strong>Email :</strong> {user?.email}</div>
          <div>
            <strong>Rôle :</strong>{' '}
            <span className={`role-badge role-${user?.role}`}>
              {user?.role}
            </span>
          </div>
          <div><strong>ID Utilisateur :</strong> {user?.id || 'N/A'}</div>
          <div><strong>Statut :</strong> ✅ Connecté</div>
        </div>
      </div>

      {/* Contenu spécifique au rôle */}
      <div style={{ marginTop: '2rem' }}>
        {renderRoleSpecificContent()}
      </div>

     

   

      {/* Bouton de déconnexion */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className="btn btn-secondary"
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#dc3545',
            borderColor: '#dc3545'
          }}
        >
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default Dashboard
