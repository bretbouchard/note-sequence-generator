'use client'

import { useState, useCallback } from 'react'
import type { NoteSequence } from '@/types/music'

interface NoteSelection {
  index: number
  scaleDegree: number
  duration: number
}

interface EditHistory {
  past: NoteSequence[]
  future: NoteSequence[]
}

export function useNoteEditing(
  sequence: NoteSequence | null,
  onSequenceUpdate: (sequence: NoteSequence) => void
) {
  const [selectedNotes, setSelectedNotes] = useState<NoteSelection[]>([])
  const [clipboard, setClipboard] = useState<NoteSelection[]>([])
  const [history, setHistory] = useState<EditHistory>({ past: [], future: [] })

  // Add to history before making changes
  const recordChange = useCallback((oldSequence: NoteSequence) => {
    setHistory(h => ({
      past: [...h.past, oldSequence],
      future: []
    }))
  }, [])

  // Select notes
  const selectNotes = useCallback((indices: number[]) => {
    if (!sequence) return
    
    const selections = indices.map(index => ({
      index,
      scaleDegree: sequence.scaleDegrees[index],
      duration: sequence.durations[index]
    }))
    setSelectedNotes(selections)
  }, [sequence])

  // Copy selected notes
  const copyNotes = useCallback(() => {
    setClipboard([...selectedNotes])
  }, [selectedNotes])

  // Paste notes at cursor position
  const pasteNotes = useCallback((startIndex: number) => {
    if (!sequence || !clipboard.length) return

    recordChange({ ...sequence })

    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    clipboard.forEach((note, i) => {
      const index = startIndex + i
      if (index < sequence.scaleDegrees.length) {
        newScaleDegrees[index] = note.scaleDegree
        newDurations[index] = note.duration
      }
    })

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, clipboard, recordChange, onSequenceUpdate])

  // Delete selected notes
  const deleteNotes = useCallback(() => {
    if (!sequence || !selectedNotes.length) return

    recordChange({ ...sequence })

    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    selectedNotes.forEach(note => {
      newScaleDegrees[note.index] = 0 // Replace with rest
      newDurations[note.index] = 1 // Reset duration
    })

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
    setSelectedNotes([])
  }, [sequence, selectedNotes, recordChange, onSequenceUpdate])

  // Undo last change
  const undo = useCallback(() => {
    if (!history.past.length) return

    const newPast = [...history.past]
    const lastState = newPast.pop()!
    
    setHistory({
      past: newPast,
      future: [sequence!, ...history.future]
    })
    onSequenceUpdate(lastState)
  }, [sequence, history, onSequenceUpdate])

  // Redo last undone change
  const redo = useCallback(() => {
    if (!history.future.length) return

    const newFuture = [...history.future]
    const nextState = newFuture.shift()!
    
    setHistory({
      past: [...history.past, sequence!],
      future: newFuture
    })
    onSequenceUpdate(nextState)
  }, [sequence, history, onSequenceUpdate])

  return {
    selectedNotes,
    selectNotes,
    copyNotes,
    pasteNotes,
    deleteNotes,
    undo,
    redo,
    hasUndo: history.past.length > 0,
    hasRedo: history.future.length > 0
  }
} 