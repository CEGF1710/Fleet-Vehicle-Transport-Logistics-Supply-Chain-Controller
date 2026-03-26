'use client'

import { useFormState } from 'react-dom'
import { createDriver } from '@/app/actions/drivers'
import { useEffect, useRef } from 'react'

const initialState = { error: '', success: false }

export default function DriverForm() {
  const [state, formAction] = useFormState(createDriver as any, initialState as any)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction}>
      {state?.error && <div className="alert error">{state.error}</div>}
      {state?.success && <div className="alert success">Conductor registrado exitosamente.</div>}
      
      <div className="form-group">
        <label>Nombre Completo</label>
        <input type="text" name="name" required placeholder="Ej: Juan Pérez" />
      </div>
      
      <div className="form-group">
        <label>Número de Licencia</label>
        <input type="text" name="licenseNumber" required placeholder="Ej: L-00129381" />
      </div>

      <button type="submit" className="btn">Guardar Conductor</button>
    </form>
  )
}
