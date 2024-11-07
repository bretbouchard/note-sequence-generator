'use client'

import { useState, useCallback } from 'react'
import type { NoteSequence } from '@/types/music'

interface ClipboardData {
  scaleDegrees: number[]
  durations: number[]
  startBar: number
  endBar: number
}

export function useClipboard() {
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null)

  // Copy selected notes to clipboard
  const copyToClipboard = useCallback((
    sequence: NoteSequence,
    selection: { startBar: number, endBar: number }
  ) => {
    const startIndex = selection.startBar * 4 // Assuming 4/4 time
    const endIndex = selection.endBar * 4

    const clipboardData: ClipboardData = {
      scaleDegrees: sequence.scaleDegrees.slice(startIndex, endIndex),
      durations: sequence.durations.slice(startIndex, endIndex),
      startBar: selection.startBar,
      endBar: selection.endBar
    }

    setClipboard(clipboardData)
  }, [])

  // Paste clipboard content at target position
  const pasteFromClipboard = useCallback((
    sequence: NoteSequence,
    targetBar: number
  ): NoteSequence | null => {
    if (!clipboard) return null

    const targetIndex = targetBar * 4 // Assuming 4/4 time
    const newScaleDegrees = [...sequence.scaleDegrees]
    const newDurations = [...sequence.durations]

    // Insert clipboard data at target position
    clipboard.scaleDegrees.forEach((degree, i) => {
      const index = targetIndex + i
      if (index < sequence.scaleDegrees.length) {
        newScaleDegrees[index] = degree
        newDurations[index] = clipboard.durations[i]
      }
    })

    return {
      ...sequence,
      scaleDegrees: newScaleDegrees,
      durations: newDurations
    }
  }, [clipboard])

  return {
    hasClipboardData: clipboard !== null,
    copyToClipboard,
    pasteFromClipboard
  }
} 