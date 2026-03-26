import { getVehicles } from '@/app/actions/vehicles'
import VehicleForm from '@/components/VehicleForm'

export const dynamic = 'force-dynamic'

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <>
      <div className="page-header">
        <h1>Gestión de Vehículos</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Flota Activa</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Marca / Modelo</th>
                  <th>Registro</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center' }}>No hay vehículos registrados</td></tr>
                ) : (
                  vehicles.map(v => (
                    <tr key={v.id}>
                      <td><strong>{v.plate}</strong></td>
                      <td>{v.brand} {v.model}</td>
                      <td>{new Date(v.createdAt).toISOString().split('T')[0]}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Nuevo Vehículo</h3>
          <VehicleForm />
        </div>
      </div>
    </>
  )
}
