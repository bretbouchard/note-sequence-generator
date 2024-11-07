'use client'

import { useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate, SequenceTemplate } from '@/types/music'
import { useTemplateConflicts } from './useTemplateConflicts'

interface TemplateSyncResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function useTemplateSync() {
  const { findOverlaps, findGaps, findBoundaryIssues } = useTemplateConflicts()

  // Validate template synchronization
  const validateSync = useCallback((
    noteTemplates: NoteTemplate[],
    rhythmTemplates: RhythmTemplate[],
    totalBars: number
  ): TemplateSyncResult => {
    const result: TemplateSyncResult = {
      isValid: true,
      errors: [],
      warnings: []
    }

    // Check for overlaps
    const noteOverlaps = findOverlaps(noteTemplates)
    const rhythmOverlaps = findOverlaps(rhythmTemplates)

    noteOverlaps.forEach(conflict => {
      result.errors.push(`Note template overlap: ${conflict.message}`)
      result.isValid = false
    })

    rhythmOverlaps.forEach(conflict => {
      result.errors.push(`Rhythm template overlap: ${conflict.message}`)
      result.isValid = false
    })

    // Check for gaps
    const noteGaps = findGaps(noteTemplates, totalBars)
    const rhythmGaps = findGaps(rhythmTemplates, totalBars)

    noteGaps.forEach(conflict => {
      result.warnings.push(`Note template gap: ${conflict.message}`)
    })

    rhythmGaps.forEach(conflict => {
      result.warnings.push(`Rhythm template gap: ${conflict.message}`)
    })

    // Check for boundary issues
    const noteBoundaryIssues = findBoundaryIssues(noteTemplates, totalBars)
    const rhythmBoundaryIssues = findBoundaryIssues(rhythmTemplates, totalBars)

    noteBoundaryIssues.forEach(conflict => {
      result.errors.push(`Note template boundary issue: ${conflict.message}`)
      result.isValid = false
    })

    rhythmBoundaryIssues.forEach(conflict => {
      result.errors.push(`Rhythm template boundary issue: ${conflict.message}`)
      result.isValid = false
    })

    // Check template alignment
    noteTemplates.forEach(noteTemplate => {
      const alignedRhythm = rhythmTemplates.find(rt => 
        rt.repetition.startBar === noteTemplate.repetition.startBar &&
        rt.repetition.duration === noteTemplate.repetition.duration
      )

      if (!alignedRhythm) {
        result.warnings.push(
          `Note template at bar ${noteTemplate.repetition.startBar} has no matching rhythm template`
        )
      }
    })

    return result
  }, [findOverlaps, findGaps, findBoundaryIssues])

  // Synchronize templates
  const syncTemplates = useCallback((
    noteTemplates: NoteTemplate[],
    rhythmTemplates: RhythmTemplate[],
    totalBars: number
  ): { noteTemplates: NoteTemplate[], rhythmTemplates: RhythmTemplate[] } => {
    const sortedNoteTemplates = [...noteTemplates].sort((a, b) => 
      a.repetition.startBar - b.repetition.startBar
    )
    const sortedRhythmTemplates = [...rhythmTemplates].sort((a, b) => 
      a.repetition.startBar - b.repetition.startBar
    )

    // Ensure templates don't exceed total bars
    const adjustedNoteTemplates = sortedNoteTemplates.map(template => ({
      ...template,
      repetition: {
        ...template.repetition,
        duration: Math.min(
          template.repetition.duration,
          totalBars - template.repetition.startBar
        )
      }
    }))

    const adjustedRhythmTemplates = sortedRhythmTemplates.map(template => ({
      ...template,
      repetition: {
        ...template.repetition,
        duration: Math.min(
          template.repetition.duration,
          totalBars - template.repetition.startBar
        )
      }
    }))

    return {
      noteTemplates: adjustedNoteTemplates,
      rhythmTemplates: adjustedRhythmTemplates
    }
  }, [])

  // Create template sequence
  const createTemplateSequence = useCallback((
    noteTemplates: NoteTemplate[],
    rhythmTemplates: RhythmTemplate[],
    totalBars: number
  ): SequenceTemplate => {
    const { noteTemplates: syncedNotes, rhythmTemplates: syncedRhythms } = 
      syncTemplates(noteTemplates, rhythmTemplates, totalBars)

    return {
      sequenceLength: totalBars,
      noteTemplates: syncedNotes,
      rhythmTemplates: syncedRhythms,
      seeds: {
        noteSeed: Math.floor(Math.random() * 1000000),
        rhythmSeed: Math.floor(Math.random() * 1000000)
      }
    }
  }, [syncTemplates])

  return {
    validateSync,
    syncTemplates,
    createTemplateSequence
  }
} 