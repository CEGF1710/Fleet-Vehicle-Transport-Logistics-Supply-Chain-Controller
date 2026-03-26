'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getVehicles() {
  return await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createVehicle(prevState: unknown, formData: FormData) {
  const plate = formData.get('plate') as string
  const model = formData.get('model') as string
  const brand = formData.get('brand') as string

  if (!plate || !model || !brand) {
    return { error: 'Todos los campos son obligatorios' }
  }

  try {
    await prisma.vehicle.create({
      data: { plate: plate.toUpperCase(), model, brand }
    })
    revalidatePath('/')
    revalidatePath('/vehicles')
    return { success: true }
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') return { error: 'La placa ya está registrada' }
    return { error: 'Error al registrar vehículo' }
  }
}
