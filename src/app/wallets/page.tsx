import { getWallets } from '@/app/actions/wallets'
import { getVehicles } from '@/app/actions/vehicles'
import { getDrivers } from '@/app/actions/drivers'
import WalletForm from '@/components/WalletForm'

export const dynamic = 'force-dynamic'

export default async function WalletsPage() {
  const wallets = await getWallets()
  const vehicles = await getVehicles()
  const drivers = await getDrivers()

  // Helper map for names/plates
  const entityMap = new Map()
  vehicles.forEach(v => entityMap.set(v.id, `Vehículo: ${v.plate}`))
  drivers.forEach(d => entityMap.set(d.id, `Conductor: ${d.name}`))

  return (
    <>
      <div className="page-header">
        <h1>Gestor de Billeteras y Presupuestos</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Billeteras Activas</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Fecha de Creación</th>
                  <th>Entidad (Vehículo o Chofer)</th>
                  <th>Presupuesto Total</th>
                  <th>Saldo Disponible</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {wallets.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center' }}>No hay presupuestos asignados</td></tr>
                ) : (
                  wallets.map(w => {
                    const lowBalance = w.balance < w.budget * 0.15 // Alerta si queda menos del 15%
                    return (
                      <tr key={w.id}>
                        <td>{new Date(w.createdAt).toISOString().split('T')[0]}</td>
                        <td>{entityMap.get(w.entityId) || 'Desconocido'}</td>
                        <td>${w.budget.toFixed(2)}</td>
                        <td>
                           <span style={{ color: lowBalance ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>
                             ${w.balance.toFixed(2)}
                           </span>
                        </td>
                        <td>
                          {lowBalance ? (
                            <span className="badge error">Fondos Bajos</span>
                          ) : (
                            <span className="badge success">Activo</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '1rem' }}>
            * Cuando se registra un viaje, se deducirá automáticamente del saldo de la billetera del vehículo (a un costo base de $1.50/L). Si el vehículo no tiene, se busca la del conductor.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Asignar Presupuesto</h3>
          <WalletForm vehicles={vehicles} drivers={drivers} />
        </div>
      </div>
    </>
  )
}
