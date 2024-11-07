'use client'

import { useCallback } from 'react'
import type { NoteSequence } from '@/types/music'

type QuantizeValue = 1 | 2 | 4 | 8 | 16 // Whole, half, quarter, eighth, sixteenth notes

export function useQuantization() {
  // Quantize a single duration value
  const quantizeDuration = useCallback((duration: number, quantizeValue: QuantizeValue): number => {
    const gridSize = 4 / quantizeValue // Convert to quarter notes
    return Math.round(duration / gridSize) * gridSize
  }, [])

  // Quantize an entire sequence
  const quantizeSequence = useCallback((sequence: NoteSequence, quantizeValue: QuantizeValue): NoteSequence => {
    return {
      ...sequence,
      durations: sequence.durations.map(duration => quantizeDuration(duration, quantizeValue))
    }
  }, [quantizeDuration])

  // Snap a beat position to grid
  const snapToGrid = useCallback((beat: number, quantizeValue: QuantizeValue): number => {
    const gridSize = 4 / quantizeValue
    return Math.round(beat / gridSize) * gridSize
  }, [])

  return {
    quantizeDuration,
    quantizeSequence,
    snapToGrid
  }
} 