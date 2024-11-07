import type { Scale, ChordProgression, SequenceTemplate } from '@/types/music'

export const validateSequenceInput = (
  key: string,
  scale: Scale,
  chordProgression: ChordProgression | undefined,
  template: SequenceTemplate
): boolean => {
  // Validate key
  if (!key || typeof key !== 'string') {
    console.error('Invalid key')
    return false
  }

  // Validate scale
  if (!scale?.degrees?.length || !scale?.intervals?.length) {
    console.error('Invalid scale structure')
    return false
  }
  if (scale.degrees.length !== scale.intervals.length) {
    console.error('Scale degrees and intervals must match')
    return false
  }

  // Validate template
  if (!template?.sequenceLength || template.sequenceLength <= 0) {
    console.error('Invalid sequence length')
    return false
  }
  
  if (!template.noteTemplates?.length) {
    console.error('No note templates provided')
    return false
  }
  
  if (!template.rhythmTemplates?.length) {
    console.error('No rhythm templates provided')
    return false
  }

  // Validate note templates
  for (const noteTemplate of template.noteTemplates) {
    if (!noteTemplate.id || !noteTemplate.scaleDegrees?.length || !noteTemplate.weights?.length) {
      console.error('Invalid note template structure')
      return false
    }
    if (noteTemplate.scaleDegrees.length !== noteTemplate.weights.length) {
      console.error('Note template degrees and weights must match')
      return false
    }
  }

  // Validate rhythm templates
  for (const rhythmTemplate of template.rhythmTemplates) {
    if (!rhythmTemplate.id || !rhythmTemplate.durations?.length) {
      console.error('Invalid rhythm template structure')
      return false
    }
    if (rhythmTemplate.templateDuration <= 0) {
      console.error('Invalid rhythm template duration')
      return false
    }
  }

  return true
} 