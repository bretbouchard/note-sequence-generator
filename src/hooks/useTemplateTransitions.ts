'use client'

import { useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface TransitionPoint {
  bar: number
  fromTemplate: NoteTemplate | RhythmTemplate
  toTemplate: NoteTemplate | RhythmTemplate
}

export function useTemplateTransitions() {
  // Find transition points between templates
  const findTransitionPoints = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[]
  ): TransitionPoint[] => {
    const sortedTemplates = [...templates].sort(
      (a, b) => a.repetition.startBar - b.repetition.startBar
    )

    const transitions: TransitionPoint[] = []
    for (let i = 0; i < sortedTemplates.length - 1; i++) {
      const current = sortedTemplates[i]
      const next = sortedTemplates[i + 1]
      const transitionBar = current.repetition.startBar + current.repetition.duration

      if (transitionBar === next.repetition.startBar) {
        transitions.push({
          bar: transitionBar,
          fromTemplate: current,
          toTemplate: next
        })
      }
    }

    return transitions
  }, [])

  return {
    findTransitionPoints
  }
} 