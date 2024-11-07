'use client'

import { useCallback } from 'react'
import type { NoteSequence } from '@/types/music'
import { useEditHistory } from './useEditHistory'
import { useClipboard } from './useClipboard'

interface NoteOperation {
  type: 'add' | 'delete' | 'move' | 'resize' | 'transpose'
  index: number
  data: {
    scaleDegree?: number
    duration?: number
    offset?: number
  }
}

export function useNoteEditingOperations(
  sequence: NoteSequence | null,
  onSequenceUpdate: (sequence: NoteSequence) => void
) {
  const { recordChange, undo, redo } = useEditHistory(sequence)
  const { copyToClipboard, pasteFromClipboard } = useClipboard()

  // Add note
  const addNote = useCallback((beat: number, degree: number, duration: number = 1) => {
    if (!sequence) return

    recordChange(sequence)
    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    // Insert at correct position
    newScaleDegrees.splice(beat, 0, degree)
    newDurations.splice(beat, 0, duration)

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, recordChange, onSequenceUpdate])

  // Delete note
  const deleteNote = useCallback((index: number) => {
    if (!sequence) return

    recordChange(sequence)
    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    newScaleDegrees.splice(index, 1)
    newDurations.splice(index, 1)

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, recordChange, onSequenceUpdate])

  // Move note
  const moveNote = useCallback((index: number, newBeat: number, newDegree: number) => {
    if (!sequence) return

    recordChange(sequence)
    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    // Remove from current position
    const [degree, duration] = [newScaleDegrees[index], newDurations[index]]
    newScaleDegrees.splice(index, 1)
    newDurations.splice(index, 1)

    // Insert at new position
    newScaleDegrees.splice(newBeat, 0, newDegree)
    newDurations.splice(newBeat, 0, duration)

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, recordChange, onSequenceUpdate])

  // Resize note
  const resizeNote = useCallback((index: number, newDuration: number) => {
    if (!sequence) return

    recordChange(sequence)
    const newDurations = [...sequence.durations]
    newDurations[index] = Math.max(1, newDuration)

    onSequenceUpdate({
      ...sequence,
      durations: newDurations
    })
  }, [sequence, recordChange, onSequenceUpdate])

  // Transpose note
  const transposeNote = useCallback((index: number, offset: number) => {
    if (!sequence) return

    recordChange(sequence)
    const newScaleDegrees = [...sequence.scaleDegrees]
    newScaleDegrees[index] = Math.max(1, Math.min(7, newScaleDegrees[index] + offset))

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees
    })
  }, [sequence, recordChange, onSequenceUpdate])

  // Copy/paste operations
  const copyNotes = useCallback((startBeat: number, endBeat: number) => {
    if (!sequence) return

    copyToClipboard({
      scaleDegrees: sequence.scaleDegrees.slice(startBeat, endBeat),
      durations: sequence.durations.slice(startBeat, endBeat)
    })
  }, [sequence, copyToClipboard])

  const pasteNotes = useCallback((targetBeat: number) => {
    if (!sequence) return

    const pastedData = pasteFromClipboard()
    if (!pastedData) return

    recordChange(sequence)
    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    // Insert pasted notes
    newScaleDegrees.splice(targetBeat, 0, ...pastedData.scaleDegrees)
    newDurations.splice(targetBeat, 0, ...pastedData.durations)

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, pasteFromClipboard, recordChange, onSequenceUpdate])

  return {
    addNote,
    deleteNote,
    moveNote,
    resizeNote,
    transposeNote,
    copyNotes,
    pasteNotes,
    undo,
    redo
  }
} 