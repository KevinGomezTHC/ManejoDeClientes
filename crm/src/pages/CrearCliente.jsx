import { useEffect, useState } from 'react'

import { supabase } from '../supabase'
import { getComerciales } from '../services/comerciales'

import '../styles/crearCliente.css'

function CrearCliente() {

  const [comerciales, setComerciales] = useState([])

  const [formData, setFormData] = useState({

    empresa: '',
    nit: '',
    direccion: '',
    correo: '',
    contacto: '',
    celular: '',
    fecha: '',
    cursos: '',
    comercial_id: ''

  })

  useEffect(() => {
    async function load() {
      const { data, error } = await getComerciales()
      if (error) {
        console.error(error)
        return
      }
      setComerciales(data)
    }

    load()
  }, [])

  function handleChange(e) {

    setFormData({

      ...formData,
      [e.target.name]: e.target.value

    })
  }

  async function crearCliente(e) {

    e.preventDefault()

    const { error } = await supabase
      .from('clientes')
      .insert([formData])

    if (error) {

      alert(error.message)
      return
    }

    alert('Cliente creado correctamente')

    setFormData({

      empresa: '',
      nit: '',
      direccion: '',
      correo: '',
      contacto: '',
      celular: '',
      fecha: '',
      cursos: '',
      comercial_id: ''

    })
  }

  return (

    <div className="crear-cliente-container">

      <form
        className="cliente-form"
        onSubmit={crearCliente}
      >

        <h1>Registro de Cliente</h1>

        <input
          type="text"
          name="empresa"
          placeholder="Nombre empresa"
          value={formData.empresa}
          onChange={handleChange}
        />

        <input
          type="text"
          name="nit"
          placeholder="NIT"
          value={formData.nit}
          onChange={handleChange}
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
        />

        <input
          type="text"
          name="contacto"
          placeholder="Persona de contacto"
          value={formData.contacto}
          onChange={handleChange}
        />

        <input
          type="text"
          name="celular"
          placeholder="Celular"
          value={formData.celular}
          onChange={handleChange}
        />

        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
        />

        <input
          type="text"
          name="cursos"
          placeholder="Cursos vendidos"
          value={formData.cursos}
          onChange={handleChange}
        />

        <select
          name="comercial_id"
          value={formData.comercial_id}
          onChange={handleChange}
        >

          <option value="">
            Seleccionar comercial
          </option>

          {

            comerciales.map((comercial) => (

              <option
                key={comercial.id}
                value={comercial.id}
              >

                {comercial.nombre}

              </option>

            ))
          }

        </select>

        <button type="submit">

          Crear Cliente

        </button>

      </form>

    </div>

  )
}

export default CrearCliente