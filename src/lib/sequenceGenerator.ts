'use client'

import type { Scale, ChordProgression, NoteSequence, SequenceTemplate } from '@/types/music'

interface SequenceOptions {
  key: string
  scale: Scale
  chordProgression: ChordProgression
  template: SequenceTemplate
}

function validateSequenceInput(
  key: string,
  scale: Scale,
  chordProgression: ChordProgression,
  template: SequenceTemplate
): boolean {
  if (!key || typeof key !== 'string') return false
  if (!scale || !Array.isArray(scale.degrees) || !Array.isArray(scale.intervals)) return false
  if (!chordProgression || !Array.isArray(chordProgression.degrees) || !Array.isArray(chordProgression.durations)) return false
  if (!template || typeof template.sequenceLength !== 'number') return false
  return true
}

export function generateSequence(options: SequenceOptions): NoteSequence {
  // Validate inputs
  if (!validateSequenceInput(options.key, options.scale, options.chordProgression, options.template)) {
    throw new Error('Invalid sequence parameters')
  }

  // Generate a basic sequence if no templates are provided
  if (!options.template.noteTemplates?.length) {
    console.log('No note templates provided')
    return generateBasicSequence(options)
  }

  // TODO: Implement template-based generation
  return generateBasicSequence(options)
}

function generateBasicSequence(options: SequenceOptions): NoteSequence {
  const { chordProgression } = options
  const totalBeats = chordProgression.durations.reduce((sum, dur) => sum + dur, 0)
  
  // Generate a simple sequence following the chord progression
  const scaleDegrees: number[] = []
  const durations: number[] = []
  
  chordProgression.degrees.forEach((degree, index) => {
    const chordDuration = chordProgression.durations[index]
    
    // Add chord tones
    for (let beat = 0; beat < chordDuration; beat++) {
      scaleDegrees.push(typeof degree === 'number' ? degree : 1) // Default to root if not a number
      durations.push(1) // Quarter notes
    }
  })

  return {
    scaleDegrees,
    durations,
    chordProgression
  }
} 