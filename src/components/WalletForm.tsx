'use client'

import { useFormState } from 'react-dom'
import { createWallet } from '@/app/actions/wallets'
import { useEffect, useRef } from 'react'

const initialState = { error: '', success: false }

export default function WalletForm({ vehicles, drivers }: { vehicles: any[], drivers: any[] }) {
  const [state, formAction] = useFormState(createWallet as any, initialState as any)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction}>
      {state?.error && <div className="alert error">{state.error}</div>}
      {state?.success && <div className="alert success">Billetera creada y presupuesto asignado.</div>}
      
      <div className="form-group">
        <label>Tipo de Entidad</label>
        <select name="entityType" required defaultValue="">
          <option value="" disabled>Seleccione...</option>
          <option value="VEHICLE">Vehículo</option>
          <option value="DRIVER">Conductor</option>
        </select>
      </div>

      <div className="form-group">
        <label>Entidad a la que se le asigna el presupuesto</label>
        <select name="entityId" required defaultValue="">
          <option value="" disabled>Seleccione la entidad específica...</option>
          <optgroup label="Vehículos">
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.plate} ({v.model})</option>
            ))}
          </optgroup>
          <optgroup label="Conductores">
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.licenseNumber})</option>
            ))}
          </optgroup>
        </select>
      </div>
      
      <div className="form-group">
        <label>Presupuesto Inicial ($)</label>
        <input type="number" step="0.01" name="budget" required placeholder="Ej. 1500.00" />
      </div>

      <button type="submit" className="btn" style={{ width: '100%' }}>Asignar Billetera</button>
    </form>
  )
}
