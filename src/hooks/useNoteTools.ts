'use client'

import { useCallback } from 'react'
import type { NoteSequence } from '@/types/music'
import { useGridSnapping } from './useGridSnapping'
import { useNoteSelection } from './useNoteSelection'

interface NoteToolsOptions {
  gridSettings: {
    gridSize: number
    snapThreshold: number
    quantizeValue: 1 | 2 | 4 | 8 | 16
  }
}

export function useNoteTools(options: NoteToolsOptions) {
  const { snapToGrid, quantizeDuration } = useGridSnapping(options.gridSettings)

  // Quantize notes to grid
  const quantizeNotes = useCallback((sequence: NoteSequence): NoteSequence => {
    return {
      ...sequence,
      durations: sequence.durations.map(duration => quantizeDuration(duration))
    }
  }, [quantizeDuration])

  // Transpose selected notes
  const transposeNotes = useCallback((
    sequence: NoteSequence,
    selectedIndices: number[],
    semitones: number
  ): NoteSequence => {
    const newDegrees = [...sequence.scaleDegrees]
    selectedIndices.forEach(index => {
      const currentDegree = newDegrees[index]
      newDegrees[index] = Math.max(1, Math.min(7, currentDegree + semitones))
    })
    return { ...sequence, scaleDegrees: newDegrees }
  }, [])

  // Adjust note durations
  const adjustDurations = useCallback((
    sequence: NoteSequence,
    selectedIndices: number[],
    factor: number
  ): NoteSequence => {
    const newDurations = [...sequence.durations]
    selectedIndices.forEach(index => {
      newDurations[index] = quantizeDuration(newDurations[index] * factor)
    })
    return { ...sequence, durations: newDurations }
  }, [quantizeDuration])

  return {
    quantizeNotes,
    transposeNotes,
    adjustDurations,
    snapToGrid
  }
} 