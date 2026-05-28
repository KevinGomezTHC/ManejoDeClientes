import '../styles/home.css'
import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate()

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
              onClick={() => navigate('/crear-cliente')}
            >
              Crear Cliente
            </button>

            <button
              onClick={() => navigate('/login')}
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