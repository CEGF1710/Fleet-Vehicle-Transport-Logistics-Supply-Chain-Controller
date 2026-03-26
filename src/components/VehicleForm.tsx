'use client'

import { useFormState } from 'react-dom'
import { createVehicle } from '@/app/actions/vehicles'
import { useEffect, useRef } from 'react'

const initialState = { error: '', success: false }

export default function VehicleForm() {
  const [state, formAction] = useFormState(createVehicle as any, initialState as any)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction}>
      {state?.error && <div className="alert error">{state.error}</div>}
      {state?.success && <div className="alert success">Vehículo registrado exitosamente.</div>}
      
      <div className="form-group">
        <label>Placa o Matrícula</label>
        <input type="text" name="plate" required placeholder="ABC-1234" />
      </div>
      
      <div className="form-group">
        <label>Marca</label>
        <input type="text" name="brand" required placeholder="Ej: Volvo" />
      </div>

      <div className="form-group">
        <label>Modelo</label>
        <input type="text" name="model" required placeholder="Ej: FH16 2023" />
      </div>

      <button type="submit" className="btn">Guardar Vehículo</button>
    </form>
  )
}
