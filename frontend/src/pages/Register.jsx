import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Page d'inscription
const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'etudiant'
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register, error, isAuthenticated } = useAuth()
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

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      navigate('/dashboard')
    } catch (err) {
      // L'erreur est gérée dans le contexte
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /[a-z]/.test(formData.password) &&
      /[0-9]/.test(formData.password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    )
  }

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        📝 Inscription
      </h2>
      
      {error && (
        <div className="alert alert-error">
          <strong>Erreur:</strong> {error}
          {error.details && (
            <ul style={{ marginTop: '0.5rem', marginBottom: '0' }}>
              {error.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
          {error.password_received && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              <strong>Mot de passe testé:</strong> {error.password_received}
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
              minLength={8}
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
          {formData.password && (
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <div style={{ 
                color: formData.password.length >= 8 ? '#28a745' : '#dc3545' 
              }}>
                ✓ {formData.password.length >= 8 ? '8+ caractères' : 'Minimum 8 caractères'}
              </div>
              <div style={{ 
                color: /[A-Z]/.test(formData.password) ? '#28a745' : '#dc3545' 
              }}>
                ✓ {/[A-Z]/.test(formData.password) ? 'Majuscule' : 'Une majuscule requise'}
              </div>
              <div style={{ 
                color: /[a-z]/.test(formData.password) ? '#28a745' : '#dc3545' 
              }}>
                ✓ {/[a-z]/.test(formData.password) ? 'Minuscule' : 'Une minuscule requise'}
              </div>
              <div style={{ 
                color: /[0-9]/.test(formData.password) ? '#28a745' : '#dc3545' 
              }}>
                ✓ {/[0-9]/.test(formData.password) ? 'Chiffre' : 'Un chiffre requis'}
              </div>
              <div style={{ 
                color: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '#28a745' : '#dc3545' 
              }}>
                ✓ {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'Caractère spécial' : 'Un caractère spécial requis (!@#$%^&*...)'}
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={showConfirmPassword ? "Confirmez votre mot de passe" : "••••••••"}
              required
              minLength={8}
              style={{ 
                paddingRight: '3rem',
                width: '100%'
              }}
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
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
              title={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Les mots de passe ne correspondent pas
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role">Rôle</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="etudiant">👨‍🎓 Étudiant</option>
            <option value="vendeur">🏪 Vendeur</option>
          </select>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#666', 
            marginTop: '0.25rem' 
          }}>
            💡 Le rôle administrateur ne peut pas être créé via inscription
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading || !isFormValid()}
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#007bff' }}>
            Se connecter
          </Link>
        </p>
      </div>

      {/* <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '4px',
        fontSize: '0.875rem'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>
          📋 Règles d'inscription :
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Email valide requis</li>
          <li><strong>Mot de passe sécurisé requis:</strong></li>
          <ul style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            <li>Minimum 8 caractères</li>
            <li>Au moins une majuscule</li>
            <li>Au moins une minuscule</li>
            <li>Au moins un chiffre</li>
            <li>Au moins un caractère spécial (!@#$%^&*...)</li>
          </ul>
          <li>Rôles disponibles : Étudiant, Vendeur</li>
          <li>Le rôle Admin est réservé (compte pré-créé)</li>
        </ul>
        
        <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#1976d2' }}>
          💡 Exemple de mot de passe valide :
        </h4>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '0.5rem', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          border: '1px solid #ddd'
        }}>
          MonMotDePasse123!
        </div>
      </div> */}



    </div>
  )
}

export default Register
