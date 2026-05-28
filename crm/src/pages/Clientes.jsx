import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import * as XLSX from 'xlsx'
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

  async function eliminarCliente(id) {
    if (!confirm('¿Está seguro de que desea eliminar este cliente?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Error: ' + error.message)
        return
      }

      // Registrar eliminación
      await supabase
        .from('auditoria')
        .insert([{
          usuario_id: user.id,
          cliente_id: id,
          accion: 'eliminar',
          fecha: new Date().toISOString()
        }])

      alert('Cliente eliminado')
      cargarClientes()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  function descargarExcel() {
    if (clientes.length === 0) {
      alert('No hay clientes para descargar')
      return
    }

    const datosExcel = clientes.map(cliente => ({
      Empresa: cliente.empresa,
      NIT: cliente.nit,
      Dirección: cliente.direccion,
      Correo: cliente.correo,
      Contacto: cliente.contacto,
      Celular: cliente.celular,
      Fecha: cliente.fecha,
      Cursos: cliente.cursos,
      Estado: cliente.estado || 'Recien contactado'
    }))

    const worksheet = XLSX.utils.json_to_sheet(datosExcel)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes')
    
    const timestamp = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `Clientes_${timestamp}.xlsx`)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="clientes-container">
      <h1>Clientes</h1>
      
      {userRole === 'administrador' && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={descargarExcel}
            style={{
              padding: '10px 20px',
              background: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📥 Descargar Excel
          </button>
        </div>
      )}

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
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setEditando(cliente.id)}
                    style={{
                      flex: 1,
                      padding: '8px 15px',
                      background: '#ff2b2b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarCliente(cliente.id)}
                    style={{
                      flex: 1,
                      padding: '8px 15px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
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