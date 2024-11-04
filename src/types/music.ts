export type Scale = {
  degrees: number[]    // Scale degrees (1-7)
  intervals: number[]  // Intervals from root
}

export type ChordProgression = {
  degrees: number[]    // Scale degrees (e.g., [1, 4, 5])
  durations: number[]  // Length of each chord
}

export type NoteTemplate = {
  probabilities: {
    scaleDegree: number
    weight: number
  }[]
}

export type NoteSequence = {
  id?: string           // For tracking transforms
  scaleDegrees: number[]  // Reference to scale degrees
  durations: number[]     // Rhythm values
  key?: string           // Optional - for display only
}

export type ChordProgressionData = {
  id: string
  name: string
  chords: Array<{
    degree: string
    scale_degree: string
    chord_notes_degree: string[]
    id: string
  }>
}

export type TransformationType = 'reverse' | 'invert' | 'transpose'

export interface TransformOptions {
  type: TransformationType
  value?: number // For transpose
}

export type MelodicPattern = {
  name: string
  generator: (chord: ChordTones) => number[]
}

export type ChordTones = {
  root: number
  third: number
  fifth: number
  seventh?: number
  tensions?: number[]
}

export type MelodyTemplate = {
  patterns: MelodicPattern[]
  weights: {
    stepwise: number      // Prefer stepwise motion
    leaps: number         // Allow larger intervals
    arpeggios: number     // Use chord tones in sequence
    approach: number      // Use approach notes
    chromatic: number     // Use chromatic passing tones
  }
  constraints: {
    maxInterval: number   // Largest allowed melodic interval
    preferredRange: {     // Preferred note range
      low: number
      high: number
    }
  }
} 