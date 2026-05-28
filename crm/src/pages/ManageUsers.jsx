import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import '../styles/home.css'

function ManageUsers() {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        rol: 'comercial'
    })

    useEffect(() => {
        cargarUsuarios()
    }, [])

    async function cargarUsuarios() {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')

            if (error) {
                console.error('Error loading usuarios:', error)
                return
            }

            setUsuarios(data || [])
        } catch (err) {
            console.error('Unexpected error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function agregarUsuario(e) {
        e.preventDefault()

        if (!formData.nombre || !formData.correo) {
            alert('Complete todos los campos')
            return
        }

        try {
            // Crear usuario en Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.correo,
                password: 'TemporalPassword123!', // Temporal, deberá cambiarla luego
            })

            if (authError) {
                alert('Error creando usuario: ' + authError.message)
                return
            }

            // Crear registro en tabla usuarios
            const { error: dbError } = await supabase
                .from('usuarios')
                .insert([{
                    id: authData.user.id,
                    nombre: formData.nombre,
                    correo: formData.correo,
                    rol: formData.rol,
                }])

            if (dbError) {
                alert('Error guardando en BD: ' + dbError.message)
                return
            }

            alert('Usuario creado correctamente')
            setFormData({ nombre: '', correo: '', rol: 'comercial' })
            cargarUsuarios()
        } catch (err) {
            console.error('Error:', err)
            alert('Error inesperado')
        }
    }

    async function eliminarUsuario(id) {
        if (!confirm('¿Está seguro?')) return

        try {
            const { error } = await supabase
                .from('usuarios')
                .delete()
                .eq('id', id)

            if (error) {
                alert('Error: ' + error.message)
                return
            }

            alert('Usuario eliminado')
            cargarUsuarios()
        } catch (err) {
            console.error('Error:', err)
        }
    }

    if (loading) {
        return (
            <div style={{ color: 'white' }}>
                Cargando...
            </div>
        )
    }

    return (
        <div
            className="list-container"
            style={{
                color: 'white'
            }}
        >
            <h1>Gestionar Usuarios</h1>

            <form onSubmit={agregarUsuario} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #faf3f3', borderRadius: '10px' }}>
                <h2>Crear Usuario</h2>

                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={{ marginBottom: '10px', padding: '10px', width: '100%', boxSizing: 'border-box' }}
                />

                <input
                    type="email"
                    placeholder="Correo"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    style={{ marginBottom: '10px', padding: '10px', width: '100%', boxSizing: 'border-box' }}
                />

                <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    style={{ marginBottom: '10px', padding: '10px', width: '100%', boxSizing: 'border-box' }}
                >
                    <option value="comercial">Comercial</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="administrador">Administrador</option>
                </select>

                <button type="submit" style={{ padding: '10px 20px', background: '#ff2b2b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Crear Usuario
                </button>
            </form>

            <h2>Usuarios Existentes</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #2e2e2e' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Correo</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Rol</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #2e2e2e' }}>
                            <td style={{ padding: '10px' }}>{u.nombre}</td>
                            <td style={{ padding: '10px' }}>{u.correo}</td>
                            <td style={{ padding: '10px' }}>{u.rol}</td>
                            <td style={{ padding: '10px' }}>
                                <button
                                    onClick={() => eliminarUsuario(u.id)}
                                    style={{ padding: '5px 10px', background: '#ff2b2b', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManageUsers
