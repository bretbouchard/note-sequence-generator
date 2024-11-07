'use client'

import { useEffect, useState } from 'react'
import { useTemplateFeedback } from '@/hooks/useTemplateFeedback'

export default function FeedbackDisplay() {
  const { feedback } = useTemplateFeedback()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (feedback.length > 0) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  if (!visible || feedback.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {feedback.map((item, index) => (
        <div
          key={item.timestamp}
          className={`px-4 py-2 rounded-md text-white transition-opacity duration-300 ${
            item.type === 'error' ? 'bg-red-600' :
            item.type === 'warning' ? 'bg-yellow-600' :
            'bg-green-600'
          }`}
          style={{
            opacity: visible ? 1 : 0,
            transform: `translateY(${-index * 10}px)`
          }}
        >
          <div className="flex items-center gap-2">
            {item.type === 'error' && <span>✕</span>}
            {item.type === 'warning' && <span>⚠</span>}
            {item.type === 'success' && <span>✓</span>}
            <p className="text-sm">{item.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 