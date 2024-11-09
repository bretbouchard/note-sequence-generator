export interface NoteTemplate {
  id: string
  name: string
  scaleDegrees: string // comma-separated numbers
  weights: string // comma-separated numbers
  repetition: string // JSON string of { startBar: number, duration: number }
  direction: 'forward' | 'backward' | 'random'
  behavior: 'continuous' | 'random'
  useChordTones: boolean
}

export interface RhythmTemplate {
  id: string
  name: string
  durations: string // comma-separated numbers
  templateDuration: number
  repetition: string // JSON string of { startBar: number, duration: number }
  direction: 'forward' | 'backward' | 'random'
  behavior: 'continuous' | 'random'
}

interface TemplateMetadata {
  autoGenerate: boolean
  complexity: number
  preferredTempo: number
  swingRatio?: number
}

export interface ChordTemplate {
  id: string
  name: string
  pattern: {
    duration: number
    notePattern: Array<{
      degrees: number[]
      durations: number[]
    }>
  }
  metadata: TemplateMetadata
}

export interface ChordTemplateCollection {
  [category: string]: ChordTemplate[]
}

export type ProgressionTemplateRule = {
  id: string
  name: string
  description: string
  pattern: {
    templateIds: string[]  // IDs of templates to apply
    applyRule: 'sequential' | 'alternate' | 'random' | 'repeat'
    repeatCount?: number   // For 'repeat' rule
  }
}

export type ProgressionTemplateCollection = {
  basic: ProgressionTemplateRule[]
  jazz: ProgressionTemplateRule[]
  latin: ProgressionTemplateRule[]
} 