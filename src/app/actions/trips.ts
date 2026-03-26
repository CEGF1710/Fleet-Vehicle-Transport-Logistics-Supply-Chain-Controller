'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTrips() {
  const trips = await prisma.trip.findMany({
    include: {
      vehicle: true,
      driver: true
    },
    orderBy: { date: 'desc' }
  })

  // Backend Logic: Performance Calculator
  return trips.map(trip => {
    const distance = trip.finalKm - trip.initialKm
    const efficiency = trip.litersConsumed > 0 ? (distance / trip.litersConsumed) : 0
    return {
      ...trip,
      distance,
      efficiency
    }
  })
}

export async function createTrip(prevState: unknown, formData: FormData) {
  const vehicleId = formData.get('vehicleId') as string
  const driverId = formData.get('driverId') as string
  const dateStr = formData.get('date') as string
  const initialKm = parseFloat(formData.get('initialKm') as string)
  const finalKm = parseFloat(formData.get('finalKm') as string)
  const litersConsumed = parseFloat(formData.get('litersConsumed') as string)

  if (!vehicleId || !driverId || !dateStr || isNaN(initialKm) || isNaN(finalKm) || isNaN(litersConsumed)) {
    return { error: 'Faltan datos obligatorios o son inválidos' }
  }

  if (finalKm <= initialKm) {
    return { error: 'El kilometraje final debe ser mayor al inicial' }
  }

  const date = new Date(dateStr)

  // Backend Logic: Mileage Validator
  const lastTrip = await prisma.trip.findFirst({
    where: { vehicleId },
    orderBy: { date: 'desc' }
  })

  if (lastTrip && initialKm < lastTrip.finalKm) {
    return { 
      error: `Inconsistencia: El KM inicial (${initialKm}) no puede ser menor al KM final del viaje anterior (${lastTrip.finalKm}) para este vehículo.`
    }
  }

  try {
    await prisma.trip.create({
      data: {
        vehicleId,
        driverId,
        date,
        initialKm,
        finalKm,
        litersConsumed
      }
    })
    revalidatePath('/')
    revalidatePath('/trips')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error interno guardando viaje.' }
  }
}
