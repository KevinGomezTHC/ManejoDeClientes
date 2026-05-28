import { useEffect, useState } from 'react'
import { getComerciales } from '../services/comerciales'
import '../styles/home.css'

function Comerciales() {
  const [comerciales, setComerciales] = useState([])

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

	return (
		<div className="list-container">
			<h1>Comerciales</h1>
			{comerciales.length === 0 ? (
				<p>No hay comerciales disponibles.</p>
			) : (
				<ul>
					{comerciales.map((c) => (
						<li key={c.id} className="list-item">
							<strong>{c.nombre}</strong>
							<div>{c.email || c.correo}</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Comerciales
