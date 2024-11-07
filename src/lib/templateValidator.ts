'use client'

import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateTemplate(
  template: NoteTemplate | RhythmTemplate,
  type: 'note' | 'rhythm',
  totalBars: number
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  // Check basic template structure
  if (!template.id) {
    result.errors.push('Template must have an ID')
    result.isValid = false
  }

  if (!template.repetition) {
    result.errors.push('Template must have repetition settings')
    result.isValid = false
  }

  // Check repetition bounds
  if (template.repetition.startBar < 0) {
    result.errors.push('Start bar cannot be negative')
    result.isValid = false
  }

  if (template.repetition.duration < 1) {
    result.errors.push('Duration must be at least 1 bar')
    result.isValid = false
  }

  if (template.repetition.startBar + template.repetition.duration > totalBars) {
    result.errors.push('Template extends beyond sequence length')
    result.isValid = false
  }

  // Type-specific validation
  if (type === 'note') {
    const noteTemplate = template as NoteTemplate
    
    // Check scale degrees
    if (!noteTemplate.scaleDegrees?.length) {
      result.errors.push('Note template must have scale degrees')
      result.isValid = false
    } else {
      // Validate each scale degree
      noteTemplate.scaleDegrees.forEach((degree, index) => {
        if (degree < 1 || degree > 7) {
          result.errors.push(`Invalid scale degree at position ${index + 1}`)
          result.isValid = false
        }
      })
    }

    // Check weights
    if (!noteTemplate.weights?.length) {
      result.warnings.push('Note template has no weights defined')
    } else if (noteTemplate.weights.length !== noteTemplate.scaleDegrees.length) {
      result.errors.push('Number of weights must match number of scale degrees')
      result.isValid = false
    }
  } else {
    const rhythmTemplate = template as RhythmTemplate
    
    // Check durations
    if (!rhythmTemplate.durations?.length) {
      result.errors.push('Rhythm template must have durations')
      result.isValid = false
    } else {
      // Validate each duration
      rhythmTemplate.durations.forEach((duration, index) => {
        if (duration < 1) {
          result.errors.push(`Invalid duration at position ${index + 1}`)
          result.isValid = false
        }
      })
    }

    // Check template duration
    const totalDuration = rhythmTemplate.durations.reduce((sum, d) => sum + d, 0)
    if (totalDuration !== rhythmTemplate.templateDuration * 4) { // Assuming 4/4 time
      result.errors.push('Total durations do not match template duration')
      result.isValid = false
    }
  }

  return result
} 