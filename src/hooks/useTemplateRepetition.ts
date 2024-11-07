import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface UseTemplateRepetitionReturn {
  calculateRepetitions: (template: NoteTemplate | RhythmTemplate, totalBars: number) => number[][]
  getTemplateAtBar: (templates: (NoteTemplate | RhythmTemplate)[], bar: number) => NoteTemplate | RhythmTemplate | null
  validateTemplateOverlap: (templates: (NoteTemplate | RhythmTemplate)[], newTemplate: NoteTemplate | RhythmTemplate) => boolean
}

export function useTemplateRepetition(): UseTemplateRepetitionReturn {
  // Calculate how many times a template repeats and where
  const calculateRepetitions = useCallback((template: NoteTemplate | RhythmTemplate, totalBars: number): number[][] => {
    const repetitions: number[][] = []
    const { startBar, duration } = template.repetition
    
    let currentBar = startBar
    while (currentBar < totalBars) {
      repetitions.push([currentBar, Math.min(currentBar + duration, totalBars)])
      currentBar += duration
    }
    
    return repetitions
  }, [])

  // Get the active template at a specific bar
  const getTemplateAtBar = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[],
    bar: number
  ): NoteTemplate | RhythmTemplate | null => {
    return templates.find(template => {
      const { startBar, duration } = template.repetition
      return bar >= startBar && bar < startBar + duration
    }) || null
  }, [])

  // Validate that a new template doesn't overlap with existing ones
  const validateTemplateOverlap = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[],
    newTemplate: NoteTemplate | RhythmTemplate
  ): boolean => {
    const { startBar, duration } = newTemplate.repetition
    const endBar = startBar + duration
    
    return !templates.some(template => {
      const templateStart = template.repetition.startBar
      const templateEnd = templateStart + template.repetition.duration
      return (
        (startBar >= templateStart && startBar < templateEnd) ||
        (endBar > templateStart && endBar <= templateEnd)
      )
    })
  }, [])

  return {
    calculateRepetitions,
    getTemplateAtBar,
    validateTemplateOverlap
  }
} 