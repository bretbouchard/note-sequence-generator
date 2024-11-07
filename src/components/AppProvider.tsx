'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAppState } from '@/hooks/useAppState'
import ErrorBoundary from './ErrorBoundary'
import LoadingSpinner from './LoadingSpinner'
import Toast from './Toast'

interface AppContextType {
  isLoading: boolean
  error: string | null
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const {
    isLoading,
    error,
    toasts,
    setLoading,
    setError,
    addToast,
    removeToast
  } = useAppState()

  return (
    <AppContext.Provider
      value={{
        isLoading,
        error,
        addToast,
        setLoading,
        setError
      }}
    >
      <ErrorBoundary>
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-red-900/90 text-white px-4 py-2 rounded-md shadow-lg">
              {error}
            </div>
          </div>
        )}

        {children}

        {/* Toast Container */}
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </ErrorBoundary>
    </AppContext.Provider>
  )
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 