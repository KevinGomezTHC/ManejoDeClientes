import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: 'red'
      }}>
        ❌ No tienes permisos para acceder a esta página
      </div>
    )
  }

  return children
}
