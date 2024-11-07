'use client'

import { useState, useCallback } from 'react'
import type { NoteSequence } from '@/types/music'

interface EditHistoryState {
  past: NoteSequence[]
  present: NoteSequence | null
  future: NoteSequence[]
}

export function useEditHistory(initialSequence: NoteSequence | null) {
  const [history, setHistory] = useState<EditHistoryState>({
    past: [],
    present: initialSequence,
    future: []
  })

  // Record a new state in history
  const recordChange = useCallback((newSequence: NoteSequence) => {
    setHistory(h => ({
      past: [...h.past, h.present!],
      present: newSequence,
      future: []
    }))
  }, [])

  // Undo last change
  const undo = useCallback(() => {
    setHistory(h => {
      if (h.past.length === 0) return h

      const newPast = [...h.past]
      const previousState = newPast.pop()!

      return {
        past: newPast,
        present: previousState,
        future: [h.present!, ...h.future]
      }
    })
  }, [])

  // Redo last undone change
  const redo = useCallback(() => {
    setHistory(h => {
      if (h.future.length === 0) return h

      const newFuture = [...h.future]
      const nextState = newFuture.shift()!

      return {
        past: [...h.past, h.present!],
        present: nextState,
        future: newFuture
      }
    })
  }, [])

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory({
      past: [],
      present: history.present,
      future: []
    })
  }, [history.present])

  return {
    currentState: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    recordChange,
    undo,
    redo,
    clearHistory
  }
} 