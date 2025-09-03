import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@flatmates.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@flatmates.com',
      password: adminPassword,
      phone: '+1234567890',
      role: 'ADMIN'
    }
  })

  // Create member users
  const memberPassword = await bcrypt.hash('member123', 12)
  
  const member1 = await prisma.user.upsert({
    where: { email: 'john@flatmates.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@flatmates.com',
      password: memberPassword,
      phone: '+1234567891',
      role: 'MEMBER'
    }
  })

  const member2 = await prisma.user.upsert({
    where: { email: 'jane@flatmates.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@flatmates.com',
      password: memberPassword,
      phone: '+1234567892',
      role: 'MEMBER'
    }
  })

  // Create some sample meal entries
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  await prisma.meal.upsert({
    where: {
      userId_date: {
        userId: member1.id,
        date: today
      }
    },
    update: {},
    create: {
      userId: member1.id,
      date: today,
      lunch: 1,
      dinner: 1
    }
  })

  await prisma.meal.upsert({
    where: {
      userId_date: {
        userId: member2.id,
        date: today
      }
    },
    update: {},
    create: {
      userId: member2.id,
      date: today,
      lunch: 1,
      dinner: 0
    }
  })

  // Create some sample contributions
  await prisma.contribution.create({
    data: {
      userId: member1.id,
      amount: 100.00,
      description: 'Grocery shopping',
      date: today
    }
  })

  await prisma.contribution.create({
    data: {
      userId: member2.id,
      amount: 50.00,
      description: 'Kitchen supplies',
      date: yesterday
    }
  })

  console.log('Seed data created successfully!')
  console.log('Admin user: admin@flatmates.com / admin123')
  console.log('Member users: john@flatmates.com / member123, jane@flatmates.com / member123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
