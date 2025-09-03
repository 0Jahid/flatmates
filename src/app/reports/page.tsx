'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface User {
  id: string
  name: string
  email: string
}

interface Meal {
  id: string
  userId: string
  date: string
  lunch: number
  dinner: number
  user: User
}

interface Contribution {
  id: string
  userId: string
  amount: number
  date: string
  user: User
}

export default function Reports() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsResponse, contributionsResponse] = await Promise.all([
          fetch('/api/meals'),
          fetch('/api/contributions')
        ])

        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json()
          setMeals(mealsData)
        }

        if (contributionsResponse.ok) {
          const contributionsData = await contributionsResponse.json()
          setContributions(contributionsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  // Aggregate meals by user
  const mealsByUser = meals.reduce((acc, meal) => {
    const userName = meal.user.name
    if (!acc[userName]) {
      acc[userName] = 0
    }
    acc[userName] += meal.lunch + meal.dinner
    return acc
  }, {} as Record<string, number>)

  // Aggregate contributions by user
  const contributionsByUser = contributions.reduce((acc, contribution) => {
    const userName = contribution.user.name
    if (!acc[userName]) {
      acc[userName] = 0
    }
    acc[userName] += contribution.amount
    return acc
  }, {} as Record<string, number>)

  const userNames = Array.from(new Set([
    ...Object.keys(mealsByUser),
    ...Object.keys(contributionsByUser)
  ]))

  const mealsChartData = {
    labels: userNames,
    datasets: [
      {
        label: 'Total Meals',
        data: userNames.map(name => mealsByUser[name] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  }

  const contributionsChartData = {
    labels: userNames,
    datasets: [
      {
        label: 'Total Contributions ($)',
        data: userNames.map(name => contributionsByUser[name] || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  }

  const pieChartData = {
    labels: userNames,
    datasets: [
      {
        data: userNames.map(name => contributionsByUser[name] || 0),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meals Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Meals by User
            </h2>
            <Bar data={mealsChartData} options={chartOptions} />
          </div>

          {/* Contributions Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Contributions by User
            </h2>
            <Bar data={contributionsChartData} options={chartOptions} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Contribution Distribution
            </h2>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut data={pieChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Summary Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Meals:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Object.values(mealsByUser).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Contributions:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${Object.values(contributionsByUser).reduce((sum, amount) => sum + amount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Users:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {userNames.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Contribution:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${userNames.length > 0 ? (Object.values(contributionsByUser).reduce((sum, amount) => sum + amount, 0) / userNames.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
