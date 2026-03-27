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

  if (initialKm < 0 || finalKm < 0 || litersConsumed < 0) {
    return { error: 'Los valores numéricos no pueden ser negativos' }
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
    // Backend Logic: Wallet Module Integration
    const cost = litersConsumed * 1.5 // Estimated fuel cost factor

    // Find wallet by vehicle first
    let wallet = await prisma.wallet.findFirst({ where: { entityId: vehicleId } })
    if (!wallet) {
      // Find wallet by driver if vehicle doesn't have one
      wallet = await prisma.wallet.findFirst({ where: { entityId: driverId } })
    }

    if (wallet && wallet.balance < cost) {
      return { error: 'Presupuesto insuficiente en la billetera asignada para cubrir este viaje.' }
    }

    // Use transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
      await tx.trip.create({
        data: { vehicleId, driverId, date, initialKm, finalKm, litersConsumed }
      })

      if (wallet) {
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: cost } }
        })
      }
    })

    revalidatePath('/')
    revalidatePath('/trips')
    revalidatePath('/wallets')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error interno guardando viaje.' }
  }
}
