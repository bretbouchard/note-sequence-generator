import { Scale, ChordProgression, NoteTemplate } from '@/types/music'

export const validateSequenceInput = (
  key: string,
  scale: Scale,
  chordProgression: ChordProgression,
  template: NoteTemplate
): boolean => {
  // Validate key
  if (!key || typeof key !== 'string') return false

  // Validate scale
  if (!scale.degrees?.length || !scale.intervals?.length) return false
  if (scale.degrees.length !== scale.intervals.length) return false

  // Validate chord progression
  if (!chordProgression.degrees?.length || !chordProgression.durations?.length) return false
  if (chordProgression.degrees.length !== chordProgression.durations.length) return false

  // Validate template
  if (!template.probabilities?.length) return false
  if (!template.probabilities.every(p => 
    typeof p.scaleDegree === 'number' && 
    typeof p.weight === 'number' && 
    p.weight >= 0
  )) return false

  return true
} 