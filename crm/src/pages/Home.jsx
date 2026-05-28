import '../styles/home.css'
import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate()

  const handleCrearCliente = () => {
    console.log('Navegando a crear cliente...')
    navigate('/crear-cliente')
  }

  const handleLogin = () => {
    console.log('Navegando a login...')
    navigate('/login')
  }

  return (

    <div className="home-container">

      <div className="overlay">

        <div className="card">

          <h1>CRM EMPRESARIAL</h1>

          <p>
            Sistema de gestión de clientes y comerciales
          </p>

          <div className="buttons">

            <button
              onClick={handleCrearCliente}
              type="button"
            >
              Crear Cliente
            </button>

            <button
              onClick={handleLogin}
              type="button"
            >
              Ingreso de Acceso
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Home