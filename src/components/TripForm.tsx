'use client'

import { useFormState } from 'react-dom'
import { createTrip } from '@/app/actions/trips'
import { useEffect, useRef } from 'react'

const initialState = { error: '', success: false }

export default function TripForm({ vehicles, drivers }: { vehicles: {id: string, plate: string, model: string}[], drivers: {id: string, name: string, licenseNumber: string}[] }) {
  const [state, formAction] = useFormState(createTrip as any, initialState as any)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction}>
      {state?.error && <div className="alert error">{state.error}</div>}
      {state?.success && <div className="alert success">Viaje registrado exitosamente.</div>}
      
      <div className="form-group">
        <label>Vehículo</label>
        <select name="vehicleId" required>
          <option value="">Seleccione...</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.plate} ({v.model})</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Conductor</label>
        <select name="driverId" required>
          <option value="">Seleccione...</option>
          {drivers.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.licenseNumber})</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fecha de Viaje</label>
        <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Kilometraje Inicial</label>
          <input type="number" step="0.1" name="initialKm" required />
        </div>

        <div className="form-group">
          <label>Kilometraje Final</label>
          <input type="number" step="0.1" name="finalKm" required />
        </div>
      </div>

      <div className="form-group">
        <label>Litros Consumidos</label>
        <input type="number" step="0.1" name="litersConsumed" required />
      </div>

      <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
        Guardar Registro de Viaje
      </button>
    </form>
  )
}
