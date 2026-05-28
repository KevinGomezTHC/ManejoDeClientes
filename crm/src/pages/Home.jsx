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

            <a href="/#/crear-cliente" style={{ textDecoration: 'none' }}>
              <button type="button" style={{ width: '100%' }}>
                Crear Cliente
              </button>
            </a>

            <a href="/#/login" style={{ textDecoration: 'none' }}>
              <button type="button" style={{ width: '100%' }}>
                Ingreso de Acceso
              </button>
            </a>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Home