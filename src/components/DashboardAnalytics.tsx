'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import jsPDF from 'jspdf'
import Papa from 'papaparse'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function DashboardAnalytics({ trips, vehicles }: { trips: any[], vehicles: any[] }) {
  // Aggregate data per vehicle
  const vehicleStats = vehicles.map(v => {
    const vTrips = trips.filter(t => t.vehicleId === v.id)
    const totalMileage = vTrips.reduce((acc, t) => acc + t.distance, 0)
    const totalFuel = vTrips.reduce((acc, t) => acc + t.litersConsumed, 0)
    
    // Find current odometer reading based on maximum finalKm
    const currentMileage = vTrips.length > 0 ? Math.max(...vTrips.map(t => t.finalKm)) : 0
    return {
      ...v,
      totalMileage,
      totalFuel,
      currentMileage
    }
  })

  // Maintenance Alerts (> 5000km)
  const maintenanceAlerts = vehicleStats.filter(v => v.currentMileage >= 5000)

  // Chart Data
  const chartData = {
    labels: vehicleStats.map(v => v.plate),
    datasets: [
      {
        label: 'Kilometraje Total (km)',
        data: vehicleStats.map(v => v.totalMileage),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Consumo de Combustible (L)',
        data: vehicleStats.map(v => v.totalFuel),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  }

  const exportCSV = () => {
    const csv = Papa.unparse(trips.map(t => ({
      Fecha: new Date(t.date).toLocaleDateString(),
      Vehiculo: t.vehicle?.plate || 'Desconocido',
      Conductor: t.driver?.name || 'Desconocido',
      'KM Inicial': t.initialKm,
      'KM Final': t.finalKm,
      Distancia: t.distance,
      Litros: t.litersConsumed,
      Rendimiento: t.efficiency ? t.efficiency.toFixed(2) : '0'
    })))
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'reporte-viajes.csv'
    link.click()
  }

  const exportJSON = () => {
    const json = JSON.stringify(trips, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'reporte-viajes.json'
    link.click()
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text('Reporte de Costos y Viajes', 14, 20)
    let y = 30
    trips.slice(0, 30).forEach((t, i) => { // Limit to 30 for base pdf iteration
      doc.text(`${new Date(t.date).toLocaleDateString()} | Vehiculo: ${t.vehicle?.plate} | Dist: ${t.distance}km | Combustible: ${t.litersConsumed}L`, 14, y)
      y += 8
    })
    doc.save('reporte-viajes.pdf')
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      
      {/* Alertas de Mantenimiento */}
      {maintenanceAlerts.length > 0 && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ color: '#b91c1c', marginBottom: '0.5rem' }}>⚠️ Alertas de Mantenimiento</h3>
          <ul style={{ color: '#7f1d1d', marginLeft: '1.5rem' }}>
            {maintenanceAlerts.map(v => (
              <li key={v.id}>El vehículo <b>{v.plate} ({v.model})</b> ha superado el umbral de mantenimiento con <b>{v.currentMileage} km</b>.</li>
            ))}
          </ul>
        </div>
      )}

      {/* Dashboard Chart */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Eficiencia: Consumo vs Kilometraje</h3>
        <div style={{ height: '300px', marginTop: '1rem' }}>
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Exportadores */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Exportar Reportes</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={exportCSV} className="btn" style={{ backgroundColor: '#10b981', color: 'white' }}>Exportar CSV</button>
          <button onClick={exportJSON} className="btn" style={{ backgroundColor: '#f59e0b', color: 'white' }}>Exportar JSON</button>
          <button onClick={exportPDF} className="btn" style={{ backgroundColor: '#ef4444', color: 'white' }}>Exportar PDF</button>
        </div>
      </div>
    </div>
  )
}
