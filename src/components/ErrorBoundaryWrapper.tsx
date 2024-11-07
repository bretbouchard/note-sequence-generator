'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { useTemplateFeedback } from '@/hooks/useTemplateFeedback'

interface Props {
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundaryWrapper extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Template error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/50 rounded-md">
          <h2 className="text-lg font-medium text-red-200 mb-2">
            Something went wrong with the template
          </h2>
          <p className="text-sm text-red-300">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-500"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
} 