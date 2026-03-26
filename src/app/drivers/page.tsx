import { getDrivers } from '@/app/actions/drivers'
import DriverForm from '@/components/DriverForm'

export const dynamic = 'force-dynamic'

export default async function DriversPage() {
  const drivers = await getDrivers()

  return (
    <>
      <div className="page-header">
        <h1>Gestión de Conductores</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Plantilla de Conductores</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Licencia</th>
                  <th>Registro</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center' }}>No hay conductores registrados</td></tr>
                ) : (
                  drivers.map(d => (
                    <tr key={d.id}>
                      <td><strong>{d.name}</strong></td>
                      <td>{d.licenseNumber}</td>
                      <td>{new Date(d.createdAt).toISOString().split('T')[0]}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Nuevo Conductor</h3>
          <DriverForm />
        </div>
      </div>
    </>
  )
}
