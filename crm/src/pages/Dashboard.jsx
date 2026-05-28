import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase'

function Dashboard() {
  const navigate = useNavigate()
  const { user, userRole, logout } = useAuth()
  const [auditoria, setAuditoria] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userRole === 'administrador') {
      cargarAuditoria()
    } else {
      setLoading(false)
    }
  }, [userRole])

  async function cargarAuditoria() {
    try {
      const { data, error } = await supabase
        .from('auditoria')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error:', error)
        return
      }

      setAuditoria(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ background: '#0f0f0f', color: 'white', minHeight: '100vh', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#ff2b2b', marginBottom: '10px' }}>Dashboard CRM</h1>
            <p>Bienvenido, <strong>{user?.email}</strong> (Rol: {userRole})</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: '10px 20px', background: '#ff2b2b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            Cerrar Sesión
          </button>
        </div>

        {userRole === 'administrador' && (
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => navigate('/clientes')}
              style={{ padding: '12px 24px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginRight: '10px' }}
            >
              📊 Ver Todos los Clientes
            </button>
            <button
              onClick={() => navigate('/manage-users')}
              style={{ padding: '12px 24px', background: '#ff2b2b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginRight: '10px' }}
            >
              👥 Gestionar Usuarios
            </button>
          </div>
        )}

        {userRole === 'administrador' && (
          <div style={{ marginTop: '30px', padding: '20px', background: '#1a1a1a', borderRadius: '10px', border: '1px solid #2e2e2e' }}>
            <h2 style={{ marginBottom: '20px', color: '#ff2b2b' }}>📋 Historial de Cambios</h2>
            
            {loading ? (
              <p>Cargando...</p>
            ) : auditoria.length === 0 ? (
              <p>No hay cambios registrados aún.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #2e2e2e' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Usuario</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Acción</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Campo</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoria.map((registro, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #2e2e2e' }}>
                        <td style={{ padding: '12px' }}>
                          {new Date(registro.fecha).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px' }}>{registro.usuario_id}</td>
                        <td style={{ padding: '12px' }}>{registro.accion}</td>
                        <td style={{ padding: '12px' }}>{registro.cliente_id}</td>
                        <td style={{ padding: '12px' }}>{registro.campo}</td>
                        <td style={{ padding: '12px' }}>{registro.valor_nuevo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {userRole === 'comercial' && (
          <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: '10px', border: '1px solid #2e2e2e' }}>
            <h2>Bienvenido al Dashboard</h2>
            <p>Desde aquí puedes navegar a tus clientes y agregar comentarios.</p>
            <button
              onClick={() => navigate('/clientes')}
              style={{ padding: '12px 24px', background: '#ff2b2b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
            >
              Ver mis Clientes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard