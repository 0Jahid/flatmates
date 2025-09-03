import { prisma } from '@/lib/prisma'
import type { User, Meal, Contribution } from '@prisma/client'

export interface UserBalance {
  userId: string
  userName: string
  userEmail: string
  userPhone: string | null
  totalMeals: number
  totalContribution: number
  balance: number
}

type UserWithMealsAndContributions = User & {
  meals: Meal[]
  contributions: Contribution[]
}

export async function calculateUserBalances(): Promise<UserBalance[]> {
  // Get all users with their meals and contributions
  const users = await prisma.user.findMany({
    include: {
      meals: true,
      contributions: true,
    }
  })

  // Calculate total meals and total contributions across all users
  let totalMealsAllUsers = 0
  let totalContributionAllUsers = 0

  users.forEach((user: UserWithMealsAndContributions) => {
    user.meals.forEach((meal: Meal) => {
      totalMealsAllUsers += meal.lunch + meal.dinner
    })
    user.contributions.forEach((contribution: Contribution) => {
      totalContributionAllUsers += contribution.amount
    })
  })

  // Calculate per meal cost
  const perMealCost = totalMealsAllUsers > 0 ? totalContributionAllUsers / totalMealsAllUsers : 0

  // Calculate balance for each user
  const userBalances: UserBalance[] = users.map((user: UserWithMealsAndContributions) => {
    const userTotalMeals = user.meals.reduce((sum: number, meal: Meal) => sum + meal.lunch + meal.dinner, 0)
    const userTotalContribution = user.contributions.reduce((sum: number, contribution: Contribution) => sum + contribution.amount, 0)
    const userBalance = userTotalContribution - (userTotalMeals * perMealCost)

    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      totalMeals: userTotalMeals,
      totalContribution: userTotalContribution,
      balance: Math.round(userBalance * 100) / 100 // Round to 2 decimal places
    }
  })

  return userBalances
}

export async function getSystemStats() {
  const users = await prisma.user.findMany({
    include: {
      meals: true,
      contributions: true,
    }
  })

  let totalMeals = 0
  let totalContributions = 0

  users.forEach((user: UserWithMealsAndContributions) => {
    user.meals.forEach((meal: Meal) => {
      totalMeals += meal.lunch + meal.dinner
    })
    user.contributions.forEach((contribution: Contribution) => {
      totalContributions += contribution.amount
    })
  })

  const perMealCost = totalMeals > 0 ? totalContributions / totalMeals : 0

  return {
    totalUsers: users.length,
    totalMeals,
    totalContributions: Math.round(totalContributions * 100) / 100,
    perMealCost: Math.round(perMealCost * 100) / 100
  }
}
