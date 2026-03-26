'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getDrivers() {
  return await prisma.driver.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createDriver(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const licenseNumber = formData.get('licenseNumber') as string

  if (!name || !licenseNumber) {
    return { error: 'Todos los campos son obligatorios' }
  }

  try {
    await prisma.driver.create({
      data: { name, licenseNumber: licenseNumber.toUpperCase() }
    })
    revalidatePath('/')
    revalidatePath('/drivers')
    return { success: true }
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') return { error: 'El número de licencia ya está registrado' }
    return { error: 'Error al registrar conductor' }
  }
}
