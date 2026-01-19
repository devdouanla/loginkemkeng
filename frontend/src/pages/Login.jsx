import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Page de connexion
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      // L'erreur est gérée dans le contexte
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        🔐 Connexion
      </h2>
      
      {error && (
        <div className="alert alert-error">
          <strong>Erreur:</strong> {error}
          {error.email_tested && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              <strong>Email testé:</strong> {error.email_tested}
            </div>
          )}
          {error.password_tested && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              <strong>Mot de passe testé:</strong> {error.password_tested}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={showPassword ? "Entrez votre mot de passe" : "••••••••"}
              required
              style={{ 
                paddingRight: '3rem',
                width: '100%'
              }}
            />
            <button
              type="button"
              onClick={togglePassword}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#666',
                padding: '0.25rem'
              }}
              title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#007bff' }}>
            S'inscrire
          </Link>
        </p>
      </div>

      {/* <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '0.875rem'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
          📋 Rôles disponibles :
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li><strong>Étudiant</strong> : Peut créer un compte et se connecter</li>
          <li><strong>Vendeur</strong> : Peut créer un compte et se connecter</li>
          <li><strong>Admin</strong> : Uniquement connexion (compte pré-créé)</li>
        </ul>
        
        <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#666' }}>
          🔑 Comptes de test :
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li><strong>Admin</strong> : admin@system.com / admin123</li>
          <li><strong>Test</strong> : test@test.com / Test123!</li>
        </ul>
      </div> */}
    </div>
  )
}

export default Login
