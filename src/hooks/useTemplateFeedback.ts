'use client'

import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface TemplateFeedback {
  type: 'success' | 'warning' | 'error'
  message: string
  timestamp: number
}

export function useTemplateFeedback() {
  const [feedback, setFeedback] = useState<TemplateFeedback[]>([])

  const addFeedback = useCallback((type: TemplateFeedback['type'], message: string) => {
    setFeedback(prev => [
      {
        type,
        message,
        timestamp: Date.now()
      },
      ...prev.slice(0, 4) // Keep last 5 messages
    ])
  }, [])

  const clearFeedback = useCallback(() => {
    setFeedback([])
  }, [])

  return {
    feedback,
    addFeedback,
    clearFeedback
  }
} 