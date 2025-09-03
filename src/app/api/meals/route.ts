import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const meals = await prisma.meal.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(meals)
  } catch (error) {
    console.error('Error fetching meals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, date, lunch, dinner } = body

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if meal entry already exists for this user and date
    const existingMeal = await prisma.meal.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date)
        }
      }
    })

    let meal
    if (existingMeal) {
      // Update existing meal
      meal = await prisma.meal.update({
        where: {
          id: existingMeal.id
        },
        data: {
          lunch: lunch || 0,
          dinner: dinner || 0
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    } else {
      // Create new meal entry
      meal = await prisma.meal.create({
        data: {
          userId,
          date: new Date(date),
          lunch: lunch || 0,
          dinner: dinner || 0
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    }

    return NextResponse.json(meal, { status: 201 })
  } catch (error) {
    console.error('Error creating meal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
