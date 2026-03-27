'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getWallets() {
  return await prisma.wallet.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createWallet(prevState: unknown, formData: FormData) {
  const entityType = formData.get('entityType') as string
  const entityId = formData.get('entityId') as string
  const budget = parseFloat(formData.get('budget') as string)

  if (!entityType || !entityId || isNaN(budget)) {
    return { error: 'Todos los campos son obligatorios y el presupuesto debe ser numérico' }
  }

  try {
    await prisma.wallet.create({
      data: {
        entityType,
        entityId,
        budget,
        balance: budget // Initial balance equals the allocated budget
      }
    })
    revalidatePath('/wallets')
    return { success: true }
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') return { error: 'Esta entidad ya tiene una billetera asignada' }
    return { error: 'Error al crear la billetera' }
  }
}

export async function addFunds(prevState: unknown, formData: FormData) {
  const walletId = formData.get('walletId') as string
  const amount = parseFloat(formData.get('amount') as string)

  if (!walletId || isNaN(amount) || amount <= 0) {
    return { error: 'Monto inválido' }
  }

  try {
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: amount },
        budget: { increment: amount }
      }
    })
    revalidatePath('/wallets')
    return { successFunds: true }
  } catch (error) {
    return { error: 'Error agregando fondos' }
  }
}
