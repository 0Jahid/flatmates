import twilio from 'twilio'
import { prisma } from '@/lib/prisma'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendWhatsAppAlert(
  userId: string,
  name: string,
  balance: number,
  phoneNumber: string
): Promise<boolean> {
  try {
    const message = `Hi ${name}, your current balance is $${balance.toFixed(2)}. Please contribute to the meal system.`
    
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: message
    })

    // Log the notification
    await prisma.notificationLog.create({
      data: {
        userId,
        type: 'WHATSAPP',
        message,
        phoneNumber,
        status: 'SENT',
        sentAt: new Date()
      }
    })

    console.log('WhatsApp message sent:', response.sid)
    return true
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error)
    
    // Log the failed notification
    await prisma.notificationLog.create({
      data: {
        userId,
        type: 'WHATSAPP',
        message: `Hi ${name}, your current balance is $${balance.toFixed(2)}. Please contribute to the meal system.`,
        phoneNumber,
        status: 'FAILED'
      }
    })
    
    return false
  }
}

export async function checkAndSendAlerts() {
  const { calculateUserBalances } = await import('@/lib/calculations')
  const userBalances = await calculateUserBalances()
  
  const alertPromises = userBalances
    .filter(user => user.balance < 0 && user.userPhone)
    .map(user => 
      sendWhatsAppAlert(
        user.userId, 
        user.userName, 
        user.balance, 
        user.userPhone!
      )
    )
  
  const results = await Promise.allSettled(alertPromises)
  const successful = results.filter(result => result.status === 'fulfilled').length
  const failed = results.filter(result => result.status === 'rejected').length
  
  return { successful, failed, total: results.length }
}
