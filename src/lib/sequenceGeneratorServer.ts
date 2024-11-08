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
    'VI': 6, 'vi': 6, 'vi7': 6,
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
  console.log('=== Sequence Generation Start ===')
  const { chordProgression, template } = options
  const noteTemplate = template.noteTemplates![0]
  const rhythmTemplate = template.rhythmTemplates![0]

  console.log('Using templates:', {
    noteTemplate,
    rhythmTemplate
  })

  const scaleDegrees: (number | null)[] = []
  const durations: number[] = []
  let currentBeat = 0
  let forward = true
  let globalRhythmIndex = 0 // Track rhythm position across all chords

  // Apply templates for each chord
  chordProgression.degrees.forEach((chordDegree, chordIndex) => {
    console.log(`\nProcessing chord ${chordIndex}:`, chordDegree)
    const chordDuration = chordProgression.durations[chordIndex]
    let remainingDuration = chordDuration

    // Reset note index based on behavior, but keep rhythm continuous
    let noteIndex = noteTemplate.behavior === 'repeat-per-chord' ? 0 : 
                   noteTemplate.behavior === 'continuous' ? currentBeat % noteTemplate.scaleDegrees.length : 
                   Math.min(currentBeat, noteTemplate.scaleDegrees.length - 1)

    // Get rhythm index based on behavior
    let rhythmIndex = rhythmTemplate.behavior === 'repeat-per-chord' ? 0 : globalRhythmIndex

    // Get chord tones
    const chordTones = getChordTones(chordDegree.toString())
    console.log('Available chord tones:', chordTones)
    console.log('Starting rhythm index:', rhythmIndex)

    while (remainingDuration > 0) {
      // Get current rhythm value and check if it's a rest
      const rhythmDuration = rhythmTemplate.durations[rhythmIndex % rhythmTemplate.durations.length]
      const isRest = rhythmTemplate.rests?.[rhythmIndex % rhythmTemplate.durations.length] || false

      if (isRest) {
        console.log(`Adding rest: duration=${rhythmDuration}, rhythmIndex=${rhythmIndex}`)
        scaleDegrees.push(null)
      } else {
        let adjustedDegree: number

        if (noteTemplate.useChordTones) {
          adjustedDegree = chordTones[noteIndex % chordTones.length]
          console.log(`Using chord tone at index ${noteIndex}: ${adjustedDegree}`)
        } else {
          const templateDegree = noteTemplate.scaleDegrees[noteIndex % noteTemplate.scaleDegrees.length]
          const numericChordDegree = typeof chordDegree === 'string' 
            ? convertChordToNumber(chordDegree)
            : chordDegree
          adjustedDegree = ((templateDegree + numericChordDegree - 1) % 7) || 7
          console.log(`Using scale degree ${templateDegree} relative to chord ${numericChordDegree}: ${adjustedDegree}`)
        }

        scaleDegrees.push(adjustedDegree)

        // Update note index based on direction
        if (noteTemplate.direction === 'forward') {
          noteIndex = (noteIndex + 1) % noteTemplate.scaleDegrees.length
        } else if (noteTemplate.direction === 'backward') {
          noteIndex = (noteIndex - 1 + noteTemplate.scaleDegrees.length) % noteTemplate.scaleDegrees.length
        } else if (noteTemplate.direction === 'pingpong') {
          if (forward) {
            if (noteIndex >= noteTemplate.scaleDegrees.length - 1) {
              forward = false
              noteIndex--
            } else {
              noteIndex++
            }
          } else {
            if (noteIndex <= 0) {
              forward = true
              noteIndex++
            } else {
              noteIndex--
            }
          }
        }
      }

      // Always add duration and advance rhythm
      durations.push(Math.min(rhythmDuration, remainingDuration))
      remainingDuration -= rhythmDuration
      currentBeat += rhythmDuration
      
      // Update rhythm indices
      rhythmIndex++
      globalRhythmIndex++

      console.log('Step:', {
        noteIndex,
        rhythmIndex: rhythmIndex % rhythmTemplate.durations.length,
        globalRhythmIndex,
        forward,
        isRest,
        duration: rhythmDuration,
        remaining: remainingDuration,
        currentBeat
      })
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
        return currentIndex >= length - 1 ? currentIndex - 1 : currentIndex + 1
      } else {
        return currentIndex <= 0 ? currentIndex + 1 : currentIndex - 1
      }
    default:
      return (currentIndex + 1) % length
  }
}

export { generateTemplateBasedSequence as generateSequenceServer }