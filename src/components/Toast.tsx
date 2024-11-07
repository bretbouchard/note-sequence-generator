'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600'
  }[type]

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white transition-opacity duration-300
        ${bgColor} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' && <span>✓</span>}
        {type === 'error' && <span>✕</span>}
        {type === 'info' && <span>ℹ</span>}
        {type === 'warning' && <span>⚠</span>}
        <p className="text-sm">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
} 