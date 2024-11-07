'use client'

import { useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface TemplateConflict {
  type: 'overlap' | 'gap' | 'duration' | 'boundary'
  bar: number
  templates: (NoteTemplate | RhythmTemplate)[]
  message: string
  severity: 'warning' | 'error'
}

export function useTemplateConflicts() {
  // Check for template overlaps
  const findOverlaps = useCallback((templates: (NoteTemplate | RhythmTemplate)[]): TemplateConflict[] => {
    const conflicts: TemplateConflict[] = []
    const sortedTemplates = [...templates].sort((a, b) => a.repetition.startBar - b.repetition.startBar)

    for (let i = 0; i < sortedTemplates.length - 1; i++) {
      const current = sortedTemplates[i]
      const next = sortedTemplates[i + 1]
      const currentEnd = current.repetition.startBar + current.repetition.duration
      
      if (currentEnd > next.repetition.startBar) {
        conflicts.push({
          type: 'overlap',
          bar: next.repetition.startBar,
          templates: [current, next],
          message: `Templates overlap at bar ${next.repetition.startBar}`,
          severity: 'error'
        })
      }
    }

    return conflicts
  }, [])

  // Check for gaps between templates
  const findGaps = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[],
    totalBars: number
  ): TemplateConflict[] => {
    const conflicts: TemplateConflict[] = []
    const sortedTemplates = [...templates].sort((a, b) => a.repetition.startBar - b.repetition.startBar)

    // Check gap at start
    if (sortedTemplates[0]?.repetition.startBar > 0) {
      conflicts.push({
        type: 'gap',
        bar: 0,
        templates: [sortedTemplates[0]],
        message: `Gap at start before bar ${sortedTemplates[0].repetition.startBar}`,
        severity: 'warning'
      })
    }

    // Check gaps between templates
    for (let i = 0; i < sortedTemplates.length - 1; i++) {
      const current = sortedTemplates[i]
      const next = sortedTemplates[i + 1]
      const currentEnd = current.repetition.startBar + current.repetition.duration
      
      if (currentEnd < next.repetition.startBar) {
        conflicts.push({
          type: 'gap',
          bar: currentEnd,
          templates: [current, next],
          message: `Gap between bars ${currentEnd} and ${next.repetition.startBar}`,
          severity: 'warning'
        })
      }
    }

    // Check gap at end
    const lastTemplate = sortedTemplates[sortedTemplates.length - 1]
    if (lastTemplate) {
      const lastEnd = lastTemplate.repetition.startBar + lastTemplate.repetition.duration
      if (lastEnd < totalBars) {
        conflicts.push({
          type: 'gap',
          bar: lastEnd,
          templates: [lastTemplate],
          message: `Gap at end after bar ${lastEnd}`,
          severity: 'warning'
        })
      }
    }

    return conflicts
  }, [])

  // Check for template boundary issues
  const findBoundaryIssues = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[],
    totalBars: number
  ): TemplateConflict[] => {
    const conflicts: TemplateConflict[] = []

    templates.forEach(template => {
      const endBar = template.repetition.startBar + template.repetition.duration

      if (endBar > totalBars) {
        conflicts.push({
          type: 'boundary',
          bar: template.repetition.startBar,
          templates: [template],
          message: `Template extends beyond sequence length at bar ${template.repetition.startBar}`,
          severity: 'error'
        })
      }

      if ('durations' in template) {
        // Check if rhythm template durations match template duration
        const totalDuration = template.durations.reduce((sum, dur) => sum + dur, 0)
        if (totalDuration !== template.templateDuration * 4) { // Assuming 4/4 time
          conflicts.push({
            type: 'duration',
            bar: template.repetition.startBar,
            templates: [template],
            message: `Rhythm template durations don't match template duration at bar ${template.repetition.startBar}`,
            severity: 'error'
          })
        }
      }
    })

    return conflicts
  }, [])

  // Resolve conflicts automatically
  const resolveConflicts = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[],
    totalBars: number
  ): (NoteTemplate | RhythmTemplate)[] => {
    const sortedTemplates = [...templates].sort((a, b) => a.repetition.startBar - b.repetition.startBar)
    const resolvedTemplates: (NoteTemplate | RhythmTemplate)[] = []

    sortedTemplates.forEach((template, index) => {
      const previousTemplate = resolvedTemplates[resolvedTemplates.length - 1]
      
      if (previousTemplate) {
        const previousEnd = previousTemplate.repetition.startBar + previousTemplate.repetition.duration
        
        // Adjust start bar if there's an overlap
        if (template.repetition.startBar < previousEnd) {
          template = {
            ...template,
            repetition: {
              ...template.repetition,
              startBar: previousEnd
            }
          }
        }
      }

      // Adjust duration if it extends beyond total bars
      const endBar = template.repetition.startBar + template.repetition.duration
      if (endBar > totalBars) {
        template = {
          ...template,
          repetition: {
            ...template.repetition,
            duration: totalBars - template.repetition.startBar
          }
        }
      }

      resolvedTemplates.push(template)
    })

    return resolvedTemplates
  }, [])

  return {
    findOverlaps,
    findGaps,
    findBoundaryIssues,
    resolveConflicts
  }
} 