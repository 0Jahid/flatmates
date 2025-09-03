'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  HomeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Meals', href: '/meals', icon: UserGroupIcon },
    { name: 'Contributions', href: '/contributions', icon: CurrencyDollarIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  ]

  if (session?.user?.role === 'ADMIN') {
    navigation.push({ name: 'Admin', href: '/admin', icon: Cog6ToothIcon })
  }

  if (!session) {
    return <div>{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            FlatMates
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {session.user?.name}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session.user?.role}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
