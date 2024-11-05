import type { Scale, ChordProgression, NoteTemplate, NoteSequence } from '@/types/music'
import { validateSequenceInput } from './sequenceValidator'

interface GeneratorOptions {
  key: string
  scale: Scale
  chordProgression: ChordProgression
  template: NoteTemplate
}

export const generateSequence = async (options: GeneratorOptions): Promise<NoteSequence> => {
  const startTime = performance.now()
  
  // Validate inputs
  if (!validateSequenceInput(options.key, options.scale, options.chordProgression, options.template)) {
    throw new Error('Invalid sequence parameters')
  }

  // Generate base sequence
  const sequence = await generateBaseSequence(options)
  
  // Apply rhythmic patterns
  const rhythmicSequence = applyRhythmicPatterns(sequence, options.chordProgression)
  
  // Apply template probabilities
  const finalSequence = applyTemplateProbabilities(rhythmicSequence, options.template)

  // Performance logging
  const endTime = performance.now()
  console.log(`Sequence generation time: ${endTime - startTime}ms`)

  return finalSequence
}

const generateBaseSequence = async (options: GeneratorOptions): Promise<NoteSequence> => {
  const { scale, chordProgression } = options
  const scaleDegrees: number[] = []
  const durations: number[] = []

  // Generate notes based on chord progression
  chordProgression.degrees.forEach((chordDegree, index) => {
    const chordDuration = chordProgression.durations[index]
    const chordNotes = generateChordNotes(chordDegree, scale)
    
    scaleDegrees.push(...chordNotes)
    durations.push(...generateNoteDurations(chordDuration))
  })

  return {
    scaleDegrees,
    durations,
    key: options.key
  }
}

const generateChordNotes = (chordDegree: number, scale: Scale): number[] => {
  // Generate chord tones based on scale degree
  const chordTones = [
    scale.degrees[(chordDegree - 1) % 7], // Root
    scale.degrees[(chordDegree + 1) % 7], // Third
    scale.degrees[(chordDegree + 3) % 7], // Fifth
  ]

  return chordTones
}

const generateNoteDurations = (totalDuration: number): number[] => {
  const patterns = [
    [1, 1, 1, 1], // Quarter notes
    [2, 2],       // Half notes
    [3, 1],       // Dotted half + quarter
    [1, 3],       // Quarter + dotted half
    [4],          // Whole note
  ]

  // Select a random pattern that fits the total duration
  const validPatterns = patterns.filter(pattern => 
    pattern.reduce((sum, val) => sum + val, 0) === totalDuration
  )

  return validPatterns[Math.floor(Math.random() * validPatterns.length)] || [totalDuration]
}

const applyRhythmicPatterns = (sequence: NoteSequence, progression: ChordProgression): NoteSequence => {
  // Apply more complex rhythmic patterns while maintaining chord structure
  const newDurations: number[] = []
  let currentIndex = 0

  progression.durations.forEach(chordDuration => {
    const notesInChord = sequence.scaleDegrees.slice(
      currentIndex,
      currentIndex + 3
    ).length

    const rhythmPattern = generateRhythmicPattern(chordDuration, notesInChord)
    newDurations.push(...rhythmPattern)
    currentIndex += notesInChord
  })

  return {
    ...sequence,
    durations: newDurations
  }
}

const generateRhythmicPattern = (totalDuration: number, noteCount: number): number[] => {
  const patterns: { [key: number]: number[][] } = {
    4: [ // Whole note duration
      [1, 1, 1, 1],     // Quarter notes
      [2, 1, 1],        // Half + two quarters
      [1, 2, 1],        // Quarter + half + quarter
      [1, 1, 2],        // Two quarters + half
      [2, 2],           // Two halves
      [3, 1],           // Dotted half + quarter
      [1, 3],           // Quarter + dotted half
      [4]               // Whole note
    ]
  }

  const availablePatterns = patterns[totalDuration] || [[totalDuration]]
  return availablePatterns[Math.floor(Math.random() * availablePatterns.length)]
}

const applyTemplateProbabilities = (sequence: NoteSequence, template: NoteTemplate): NoteSequence => {
  const newScaleDegrees = sequence.scaleDegrees.map(degree => {
    const random = Math.random()
    let cumulativeProbability = 0

    // Find the new scale degree based on template probabilities
    for (const prob of template.probabilities) {
      cumulativeProbability += prob.weight
      if (random <= cumulativeProbability) {
        return prob.scaleDegree
      }
    }

    return degree
  })

  return {
    ...sequence,
    scaleDegrees: newScaleDegrees
  }
} 