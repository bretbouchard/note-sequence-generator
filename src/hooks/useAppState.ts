'use client'

import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/Toast'

interface AppState {
  isLoading: boolean
  error: string | null
  toasts: Array<{
    id: string
    message: string
    type: ToastType
  }>
}

export function useAppState() {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    error: null,
    toasts: []
  })

  // Set loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }))
  }, [])

  // Set error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  // Add toast notification
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setState(prev => ({
      ...prev,
      toasts: [...prev.toasts, { id, message, type }]
    }))

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }, [])

  // Remove toast notification
  const removeToast = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      toasts: prev.toasts.filter(toast => toast.id !== id)
    }))
  }, [])

  // Clear all errors and toasts
  const clearNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      toasts: []
    }))
  }, [])

  return {
    isLoading: state.isLoading,
    error: state.error,
    toasts: state.toasts,
    setLoading,
    setError,
    addToast,
    removeToast,
    clearNotifications
  }
} 