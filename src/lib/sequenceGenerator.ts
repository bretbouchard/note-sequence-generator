import { Scale, ChordProgression, NoteTemplate, NoteSequence, MelodyTemplate, ChordTones } from '@/types/music'

const normalizeWeights = (weights: number[]): number[] => {
  const sum = weights.reduce((acc, val) => acc + val, 0)
  return weights.map(w => w / sum)
}

const selectFromWeightedArray = (items: number[], weights: number[]): number => {
  const normalizedWeights = normalizeWeights(weights)
  const random = Math.random()
  let sum = 0
  
  for (let i = 0; i < normalizedWeights.length; i++) {
    sum += normalizedWeights[i]
    if (random <= sum) return items[i]
  }
  
  return items[items.length - 1]
}

// Generate rhythm patterns based on chord duration
const generateRhythm = (chordDuration: number): number[] => {
  const patterns = [
    [1, 1, 1, 1],           // Quarter notes
    [2, 2],                 // Half notes
    [1.5, 1.5, 1],         // Dotted quarters + quarter
    [1, 0.5, 0.5, 1, 1],   // Syncopated pattern
    [3, 1],                // Dotted half + quarter
  ]
  
  // Select a random pattern that fits the duration
  const validPatterns = patterns.filter(p => 
    p.reduce((sum, val) => sum + val, 0) === chordDuration
  )
  
  return validPatterns[Math.floor(Math.random() * validPatterns.length)] || [chordDuration]
}

// Get scale degrees that are consonant with the current chord
const getConsonantDegrees = (chordDegree: number): number[] => {
  // Basic chord tones (1-3-5 relative to chord root)
  const chordTones = [0, 2, 4].map(interval => ((chordDegree + interval - 1) % 7) + 1)
  
  // Add approach tones and passing tones
  const approachTones = [
    ((chordDegree - 2 + 7) % 7) + 1,  // One scale degree below
    ((chordDegree) % 7) + 1,          // One scale degree above
  ]
  
  return [...new Set([...chordTones, ...approachTones])]
}

// Melodic pattern generators
const melodicPatterns = {
  stepwise: (chord: ChordTones) => {
    const scale = getScaleFromChord(chord)
    const direction = Math.random() > 0.5 ? 1 : -1
    return [chord.root, chord.root + direction, chord.root + direction * 2]
  },

  arpeggioUp: (chord: ChordTones) => {
    return [chord.root, chord.third, chord.fifth]
  },

  arpeggioDown: (chord: ChordTones) => {
    return [chord.fifth, chord.third, chord.root]
  },

  approach: (chord: ChordTones) => {
    // Approach notes to chord tones
    return [chord.root - 1, chord.root, chord.third - 1, chord.third]
  },

  enclosure: (chord: ChordTones) => {
    // Surround chord tones with upper and lower neighbors
    return [chord.root + 1, chord.root - 1, chord.root]
  }
}

const generateMelodyForChord = (
  chord: ChordTones,
  template: MelodyTemplate,
  duration: number
) => {
  const notes: number[] = []
  let remainingDuration = duration

  while (remainingDuration > 0) {
    // Select pattern based on weights
    const pattern = selectWeightedPattern(template)
    const patternNotes = pattern.generator(chord)
    
    // Apply constraints
    const constrainedNotes = applyConstraints(patternNotes, template.constraints)
    
    notes.push(...constrainedNotes)
    remainingDuration -= patternNotes.length
  }

  return notes
}

// Helper function to get scale from chord
const getScaleFromChord = (chord: ChordTones): number[] => {
  return [
    chord.root,
    chord.third,
    chord.fifth,
    ...(chord.seventh ? [chord.seventh] : []),
    ...(chord.tensions || [])
  ]
}

// Helper function to select weighted pattern
const selectWeightedPattern = (template: MelodyTemplate) => {
  const patterns = template.patterns
  const weights = patterns.map(pattern => {
    switch (pattern.name) {
      case 'stepwise': return template.weights.stepwise
      case 'arpeggioUp': 
      case 'arpeggioDown': return template.weights.arpeggios
      case 'approach': return template.weights.approach
      default: return 1
    }
  })

  const index = selectFromWeightedArray(
    patterns.map((_, i) => i),
    weights
  )
  return patterns[index]
}

// Helper function to apply constraints
const applyConstraints = (notes: number[], constraints: MelodyTemplate['constraints']) => {
  return notes.map(note => {
    // Keep note within preferred range
    if (note < constraints.preferredRange.low) {
      return note + 7 // Octave up
    }
    if (note > constraints.preferredRange.high) {
      return note - 7 // Octave down
    }
    return note
  })
}

export const generateSequence = async ({
  key,
  scale,
  chordProgression,
  template,
  providedDurations
}: {
  key: string
  scale: Scale
  chordProgression: ChordProgression
  template: { probabilities: NoteTemplate[] }
  providedDurations?: number[]
}): Promise<NoteSequence> => {
  const scaleDegrees: number[] = []
  const durations: number[] = []
  
  // Use provided durations or defaults
  const chordDurations = providedDurations || chordProgression.durations

  // Generate notes based on template probabilities and chord progression
  for (let i = 0; i < chordProgression.degrees.length; i++) {
    const chordDuration = chordDurations[i]
    const chordDegree = chordProgression.degrees[i]
    const currentTemplate = template.probabilities[i]
    
    // Create chord tones object
    const chord: ChordTones = {
      root: chordDegree,
      third: ((chordDegree + 2) % 7) || 7,
      fifth: ((chordDegree + 4) % 7) || 7
    }
    
    // Get consonant scale degrees for this chord
    const consonantDegrees = getConsonantDegrees(chordDegree)
    
    // Generate rhythm for this chord
    const rhythmPattern = generateRhythm(chordDuration)
    
    // Generate notes for each rhythm value
    rhythmPattern.forEach(duration => {
      let selectedDegree: number

      // Check if currentTemplate exists and has preferredNotes
      if (currentTemplate?.preferredNotes && currentTemplate.preferredNotes.length > 0) {
        // Use template's preferred notes if available
        const noteIndex = Math.floor(Math.random() * currentTemplate.preferredNotes.length)
        const relativeDegree = currentTemplate.preferredNotes[noteIndex]
        selectedDegree = ((chordDegree + relativeDegree - 1) % 7) || 7
      } else {
        // Fall back to probability-based selection
        const degrees = template.probabilities.map(p => p.scaleDegree)
        const weights = template.probabilities.map(p => {
          let weight = p.weight || 1 // Default weight if not specified
          if (consonantDegrees.includes(p.scaleDegree)) {
            weight *= 1.5
          }
          if ([chord.root, chord.third, chord.fifth].includes(p.scaleDegree)) {
            weight *= 1.2
          }
          return weight
        })
        
        selectedDegree = selectFromWeightedArray(degrees, weights)
      }
      
      scaleDegrees.push(selectedDegree)
      durations.push(duration)
    })
  }
  
  return {
    scaleDegrees,
    durations,
    key,
    id: Math.random().toString(36).substr(2, 9)
  }
} 