import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import '../styles/clientes.css'

function Clientes() {
  const { user, userRole } = useAuth()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    cargarClientes()
  }, [user, userRole])

  async function cargarClientes() {
    try {
      let query = supabase.from('clientes').select('*')

      // Si es comercial, solo ver sus clientes
      if (userRole === 'comercial') {
        query = query.eq('comercial_id', user.id)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error:', error)
        return
      }

      setClientes(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function agregarComentario(clienteId) {
    if (!comentario.trim()) {
      alert('Escribe un comentario')
      return
    }

    try {
      const { error } = await supabase
        .from('comentarios')
        .insert([{
          cliente_id: clienteId,
          usuario_id: user.id,
          texto: comentario,
          fecha: new Date().toISOString()
        }])

      if (error) {
        alert('Error: ' + error.message)
        return
      }

      setComentario('')
      alert('Comentario agregado')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  async function actualizarCliente(id, campo, valor) {
    try {
      const { error } = await supabase
        .from('clientes')
        .update({ [campo]: valor })
        .eq('id', id)

      if (error) {
        alert('Error: ' + error.message)
        return
      }

      // Registrar cambio
      await supabase
        .from('auditoria')
        .insert([{
          usuario_id: user.id,
          cliente_id: id,
          accion: 'actualizar',
          campo: campo,
          valor_nuevo: valor,
          fecha: new Date().toISOString()
        }])

      cargarClientes()
      alert('Cliente actualizado')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="clientes-container">
      <h1>Clientes</h1>
      {clientes.length === 0 ? (
        <p>No hay clientes disponibles.</p>
      ) : (
        <div className="clientes-grid">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="cliente-card">
              <h2>{cliente.empresa}</h2>
              <p><strong>NIT:</strong> {cliente.nit}</p>
              <p><strong>Correo:</strong> {cliente.correo}</p>
              <p><strong>Contacto:</strong> {cliente.contacto}</p>
              <p><strong>Celular:</strong> {cliente.celular}</p>
              <p><strong>Cursos:</strong> {cliente.cursos}</p>
              <p><strong>Estado:</strong> {cliente.estado || 'Recien contactado'}</p>

              {userRole === 'administrador' && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => setEditando(cliente.id)}
                    style={{ marginRight: '10px', padding: '8px 15px', background: '#ff2b2b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                </div>
              )}

              {editando === cliente.id && userRole === 'administrador' && (
                <div style={{ marginTop: '15px', padding: '10px', background: '#0f0f0f', borderRadius: '5px' }}>
                  <input
                    type="text"
                    defaultValue={cliente.empresa}
                    onBlur={(e) => actualizarCliente(cliente.id, 'empresa', e.target.value)}
                    placeholder="Empresa"
                    style={{ marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
                  />
                  <button onClick={() => setEditando(null)} style={{ padding: '8px 15px', background: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Listo
                  </button>
                </div>
              )}

              <div style={{ marginTop: '15px' }}>
                <h4>Comentarios:</h4>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Agregar comentario..."
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', background: '#0f0f0f', color: '#bdbdbd', border: '1px solid #2e2e2e', borderRadius: '5px' }}
                />
                <button
                  onClick={() => agregarComentario(cliente.id)}
                  style={{ padding: '8px 15px', background: '#ff2b2b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Comentar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Clientes