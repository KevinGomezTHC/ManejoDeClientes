import { HashRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CrearCliente from './pages/CrearCliente'
import Clientes from './pages/Clientes'
import Comerciales from './pages/Comerciales'
import ManageUsers from './pages/ManageUsers'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {

  return (

    <HashRouter>

      <Routes>

        <Route
          path='/'
          element={<Home />}
        />

        <Route
          path='/login'
          element={<Login />}
        />

        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/clientes'
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path='/comerciales'
          element={
            <ProtectedRoute>
              <Comerciales />
            </ProtectedRoute>
          }
        />

        <Route
          path='/crear-cliente'
          element={
            <ProtectedRoute>
              <CrearCliente />
            </ProtectedRoute>
          }
        />

        <Route
          path='/manage-users'
          element={
            <ProtectedRoute requiredRole="administrador">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

      </Routes>

    </HashRouter>

  )
}

export default App