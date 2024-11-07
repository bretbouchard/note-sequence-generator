'use client'

import { useState, useCallback } from 'react'
import type { NoteSequence } from '@/types/music'

interface SelectionArea {
  startX: number
  startY: number
  endX: number
  endY: number
}

interface NoteSelection {
  index: number
  scaleDegree: number
  duration: number
}

export function useNoteSelection(sequence: NoteSequence | null) {
  const [selectedNotes, setSelectedNotes] = useState<NoteSelection[]>([])
  const [selectionArea, setSelectionArea] = useState<SelectionArea | null>(null)
  const [isShiftPressed, setIsShiftPressed] = useState(false)

  // Start selection area
  const startSelection = useCallback((x: number, y: number) => {
    setSelectionArea({
      startX: x,
      startY: y,
      endX: x,
      endY: y
    })
  }, [])

  // Update selection area
  const updateSelection = useCallback((x: number, y: number) => {
    if (!selectionArea) return
    setSelectionArea(prev => prev ? {
      ...prev,
      endX: x,
      endY: y
    } : null)
  }, [selectionArea])

  // Finish selection and select notes
  const finishSelection = useCallback(() => {
    if (!selectionArea || !sequence) return

    const minX = Math.min(selectionArea.startX, selectionArea.endX)
    const maxX = Math.max(selectionArea.startX, selectionArea.endX)
    const minY = Math.min(selectionArea.startY, selectionArea.endY)
    const maxY = Math.max(selectionArea.startY, selectionArea.endY)

    // Find notes within selection area
    const newSelections = sequence.scaleDegrees.map((degree, index) => {
      const noteX = index * 40 // Assuming 40px grid size
      const noteY = (7 - degree) * 40
      
      if (noteX >= minX && noteX <= maxX && noteY >= minY && noteY <= maxY) {
        return {
          index,
          scaleDegree: degree,
          duration: sequence.durations[index]
        }
      }
      return null
    }).filter((note): note is NoteSelection => note !== null)

    // Add to or replace existing selection based on shift key
    setSelectedNotes(prev => 
      isShiftPressed ? [...prev, ...newSelections] : newSelections
    )
    setSelectionArea(null)
  }, [selectionArea, sequence, isShiftPressed])

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedNotes([])
    setSelectionArea(null)
  }, [])

  return {
    selectedNotes,
    selectionArea,
    startSelection,
    updateSelection,
    finishSelection,
    clearSelection,
    setIsShiftPressed
  }
} 