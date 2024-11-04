export interface ChordTemplate {
  id: string
  name: string
  pattern: {
    duration: number        // Base duration (e.g., 4 for whole note)
    notePattern: {
      degrees: number[]     // Scale degrees relative to chord root
      durations: number[]   // Relative durations
      velocities?: number[] // Optional - for future MIDI support
    }[]
  }
  description?: string
}

export interface ChordTemplateCollection {
  [key: string]: ChordTemplate[]
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