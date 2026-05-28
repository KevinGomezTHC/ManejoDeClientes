import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../supabase'

import '../styles/login.css'

function Login() {

  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  async function iniciarSesion(e) {

    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({

      email: correo,
      password: password

    })

    if (error) {

      alert(error.message)
      return
    }

    console.log(data)

    navigate('/dashboard')
  }

  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={iniciarSesion}
      >

        <h1>Ingreso CRM</h1>

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">

          Ingresar

        </button>

      </form>

    </div>

  )
}

export default Login