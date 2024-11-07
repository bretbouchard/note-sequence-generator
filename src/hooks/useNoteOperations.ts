'use client'

import { useCallback } from 'react'
import type { NoteSequence } from '@/types/music'

interface NoteOperation {
  type: 'add' | 'delete' | 'move' | 'resize'
  index: number
  data: {
    degree?: number
    startBeat?: number
    duration?: number
  }
}

export function useNoteOperations(
  sequence: NoteSequence | null,
  onSequenceUpdate: (sequence: NoteSequence) => void
) {
  // Add note
  const addNote = useCallback((beat: number, degree: number, duration: number = 1) => {
    if (!sequence) return

    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    // Find insert position
    let insertIndex = 0
    let currentBeat = 0
    while (currentBeat < beat && insertIndex < newScaleDegrees.length) {
      currentBeat += newDurations[insertIndex]
      insertIndex++
    }

    // Insert new note
    newScaleDegrees.splice(insertIndex, 0, degree)
    newDurations.splice(insertIndex, 0, duration)

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, onSequenceUpdate])

  // Delete note
  const deleteNote = useCallback((index: number) => {
    if (!sequence) return

    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    newScaleDegrees.splice(index, 1)
    newDurations.splice(index, 1)

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, onSequenceUpdate])

  // Move note
  const moveNote = useCallback((index: number, newBeat: number, newDegree: number) => {
    if (!sequence) return

    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    // Remove note from current position
    const [degree, duration] = [newScaleDegrees[index], newDurations[index]]
    newScaleDegrees.splice(index, 1)
    newDurations.splice(index, 1)

    // Find new insert position
    let insertIndex = 0
    let currentBeat = 0
    while (currentBeat < newBeat && insertIndex < newScaleDegrees.length) {
      currentBeat += newDurations[insertIndex]
      insertIndex++
    }

    // Insert note at new position
    newScaleDegrees.splice(insertIndex, 0, newDegree)
    newDurations.splice(insertIndex, 0, duration)

    onSequenceUpdate({
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    })
  }, [sequence, onSequenceUpdate])

  // Resize note
  const resizeNote = useCallback((index: number, newDuration: number) => {
    if (!sequence) return

    const newDurations = [...sequence.durations]
    newDurations[index] = Math.max(1, newDuration)

    onSequenceUpdate({
      ...sequence,
      durations: newDurations
    })
  }, [sequence, onSequenceUpdate])

  return {
    addNote,
    deleteNote,
    moveNote,
    resizeNote
  }
} 