import { getTrips } from './actions/trips'
import { getVehicles } from './actions/vehicles'
import { getDrivers } from './actions/drivers'
import TripForm from '@/components/TripForm'

import DashboardAnalytics from '@/components/DashboardAnalytics'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const trips = await getTrips()
  const vehicles = await getVehicles()
  const drivers = await getDrivers()

  return (
    <>
      <div className="page-header">
        <h1>Dashboard - Registro Logístico de Viajes</h1>
      </div>
      
      <DashboardAnalytics trips={trips} vehicles={vehicles} />

      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Auditoría Cronológica de Flota</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Vehículo</th>
                  <th>Conductor</th>
                  <th>KMs (In - Fn)</th>
                  <th>Distancia</th>
                  <th>Combustible</th>
                  <th>Rendimiento</th>
                </tr>
              </thead>
              <tbody>
                {trips.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center' }}>No hay viajes registrados</td></tr>
                ) : (
                  trips.map(trip => {
                    const effClass = trip.efficiency > 10 ? 'success' : (trip.efficiency < 5 ? 'error' : 'warning')
                    return (
                      <tr key={trip.id}>
                        <td>{new Date(trip.date).toISOString().split('T')[0]}</td>
                        <td>{trip.vehicle.plate}</td>
                        <td>{trip.driver.name}</td>
                        <td>{trip.initialKm} - {trip.finalKm}</td>
                        <td>{trip.distance} km</td>
                        <td>{trip.litersConsumed} L</td>
                        <td>
                          <span className={`badge ${effClass}`}>
                            {trip.efficiency.toFixed(2)} km/L
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Registrar Nuevo Viaje</h3>
          <TripForm vehicles={vehicles} drivers={drivers} />
        </div>
      </div>
    </>
  )
}
