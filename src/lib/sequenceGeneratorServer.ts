// Remove 'use client' directive - this is a server-side module
import type { Scale, ChordProgression, NoteSequence, SequenceTemplate, NoteTemplate, RhythmTemplate } from '@/types/music'

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

// Helper functions first
function convertChordToNumber(chord: string): number {
  const chordMap: Record<string, number> = {
    'I': 1, 'i': 1, 'Imaj7': 1,
    'II': 2, 'ii': 2, 'ii7': 2,
    'III': 3, 'iii': 3,
    'IV': 4, 'iv': 4,
    'V': 5, 'v': 5, 'V7': 5,
    'VI': 6, 'vi': 6,
    'VII': 7, 'vii': 7
  }
  
  const root = chordMap[chord]
  if (!root) {
    console.warn('Unknown chord symbol:', chord)
    return 1
  }
  return root
}

function getChordTones(chord: string): number[] {
  const root = convertChordToNumber(chord)
  
  // Define intervals based on chord quality
  if (chord.includes('maj7')) {
    return [root, ((root + 2) % 7) || 7, ((root + 4) % 7) || 7, ((root + 6) % 7) || 7]
  } else if (chord.includes('7')) {
    return [root, ((root + 2) % 7) || 7, ((root + 4) % 7) || 7, ((root + 5) % 7) || 7]
  } else if (chord.toLowerCase() === chord) { // minor
    return [root, ((root + 1) % 7) || 7, ((root + 4) % 7) || 7]
  } else { // major
    return [root, ((root + 2) % 7) || 7, ((root + 4) % 7) || 7]
  }
}

// Main sequence generation function
function generateTemplateBasedSequence(options: SequenceOptions): NoteSequence {
  const { chordProgression, template } = options
  
  // Default templates if none provided
  const defaultNoteTemplate: NoteTemplate = {
    id: 'default-note',
    scaleDegrees: [1, 2, 3, 4, 5],
    weights: [1, 1, 1, 1, 1],
    repetition: { startBar: 0, duration: 4 },
    direction: 'forward',
    behavior: 'continuous',
    useChordTones: false
  }

  const defaultRhythmTemplate: RhythmTemplate = {
    id: 'default-rhythm',
    durations: [1, 1, 1, 1],
    templateDuration: 4,
    repetition: { startBar: 0, duration: 4 },
    behavior: 'continuous'
  }

  console.log('Sequence Generator Input:', {
    chordProgression,
    template,
    noteTemplate: template.noteTemplates?.[0] || defaultNoteTemplate,
    rhythmTemplate: template.rhythmTemplates?.[0] || defaultRhythmTemplate
  })

  const noteTemplate = template.noteTemplates?.[0] || defaultNoteTemplate
  const rhythmTemplate = template.rhythmTemplates?.[0] || defaultRhythmTemplate

  console.log('Using template values:', {
    scaleDegrees: noteTemplate.scaleDegrees,
    direction: noteTemplate.direction,
    behavior: noteTemplate.behavior,
    useChordTones: noteTemplate.useChordTones,
    rhythmDurations: rhythmTemplate.durations
  })

  const scaleDegrees: number[] = []
  const durations: number[] = []
  let currentBeat = 0

  // Apply templates for each chord
  chordProgression.degrees.forEach((chordDegree, chordIndex) => {
    if (!chordDegree) return
    
    console.log(`Processing chord ${chordIndex}:`, chordDegree)
    const chordDuration = chordProgression.durations[chordIndex]
    let remainingDuration = chordDuration
    
    // Initialize indices based on behavior
    let noteIndex = noteTemplate.behavior === 'repeat-per-chord' ? 0 : 
                   noteTemplate.behavior === 'continuous' ? currentBeat % noteTemplate.scaleDegrees.length : 
                   Math.min(currentBeat, noteTemplate.scaleDegrees.length - 1)
    
    let rhythmIndex = rhythmTemplate.behavior === 'repeat-per-chord' ? 0 :
                     rhythmTemplate.behavior === 'continuous' ? currentBeat % rhythmTemplate.durations.length :
                     Math.min(currentBeat, rhythmTemplate.durations.length - 1)

    // Get chord tones for this chord
    const chordTones = getChordTones(chordDegree)
    console.log('Available chord tones:', chordTones)

    // Direction state
    let forward = true

    while (remainingDuration > 0) {
      // Get current template values
      const templateDegree = noteTemplate.scaleDegrees[
        getNextIndex(noteIndex, noteTemplate.scaleDegrees.length, noteTemplate.direction, forward)
      ]
      const rhythmDuration = rhythmTemplate.durations[rhythmIndex]
      const isRest = rhythmTemplate.rests?.[rhythmIndex] || false

      let degree: number | null = null

      if (!isRest) {
        if (noteTemplate.useChordTones) {
          // Use chord tones directly
          const toneIndex = getNextIndex(noteIndex, chordTones.length, noteTemplate.direction, forward)
          degree = chordTones[toneIndex]
        } else {
          // Use scale degrees relative to chord
          const numericChordDegree = typeof chordDegree === 'string' 
            ? convertChordToNumber(chordDegree)
            : chordDegree
          degree = ((templateDegree + numericChordDegree - 1) % 7) || 7
        }
      }

      // Add the note or rest
      scaleDegrees.push(degree)
      durations.push(Math.min(rhythmDuration, remainingDuration))

      // Update counters
      remainingDuration -= rhythmDuration
      currentBeat += rhythmDuration

      // Update indices and direction
      if (noteTemplate.direction === 'pingpong') {
        const nextIndex = noteTemplate.useChordTones 
          ? noteIndex + (forward ? 1 : -1)
          : noteIndex + (forward ? 1 : -1)

        if (nextIndex >= (noteTemplate.useChordTones ? chordTones.length : noteTemplate.scaleDegrees.length) || nextIndex < 0) {
          forward = !forward
        }
      }

      noteIndex = getNextIndex(
        noteIndex,
        noteTemplate.useChordTones ? chordTones.length : noteTemplate.scaleDegrees.length,
        noteTemplate.direction,
        forward
      )

      rhythmIndex = getNextIndex(
        rhythmIndex,
        rhythmTemplate.durations.length,
        'forward', // rhythm always goes forward
        true
      )
    }
  })

  const result = {
    scaleDegrees,
    durations,
    chordProgression
  }

  console.log('Generated sequence:', result)
  return result
}

function getNextIndex(currentIndex: number, length: number, direction: PatternDirection, forward: boolean): number {
  switch (direction) {
    case 'forward':
      return (currentIndex + 1) % length
    case 'backward':
      return (currentIndex - 1 + length) % length
    case 'pingpong':
      if (forward) {
        return currentIndex + 1 >= length ? length - 2 : currentIndex + 1
      } else {
        return currentIndex - 1 < 0 ? 1 : currentIndex - 1
      }
    default:
      return (currentIndex + 1) % length
  }
}

export { generateTemplateBasedSequence as generateSequenceServer }