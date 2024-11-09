import { ChordTemplateCollection } from '@/types/templates'

const ChordTemplates: ChordTemplateCollection = {
  basic: [
    {
      id: 'whole-note',
      name: 'Whole Note',
      pattern: {
        duration: 4,
        notePattern: [
          { degrees: [1, 3, 5], durations: [4] }
        ]
      },
      metadata: {
        autoGenerate: true,
        complexity: 1,
        preferredTempo: 80
      }
    },
    {
      id: 'arpeggio-up',
      name: 'Arpeggio Up',
      pattern: {
        duration: 4,
        notePattern: [
          { degrees: [1], durations: [1] },
          { degrees: [3], durations: [1] },
          { degrees: [5], durations: [1] },
          { degrees: [1], durations: [1] }
        ]
      },
      metadata: {
        autoGenerate: true,
        complexity: 1,
        preferredTempo: 80
      }
    },
    {
      id: 'arpeggio-down',
      name: 'Arpeggio Down',
      pattern: {
        duration: 4,
        notePattern: [
          { degrees: [5], durations: [1] },
          { degrees: [3], durations: [1] },
          { degrees: [1], durations: [1] },
          { degrees: [3], durations: [1] }
        ]
      },
      metadata: {
        autoGenerate: true,
        complexity: 1,
        preferredTempo: 80
      }
    }
  ],
  jazz: [
    {
      id: 'swing-pattern',
      name: 'Swing Pattern',
      pattern: {
        duration: 4,
        notePattern: [
          { degrees: [1, 3, 5], durations: [1.5] },
          { degrees: [7], durations: [0.5] },
          { degrees: [3, 5], durations: [1] },
          { degrees: [1], durations: [1] }
        ]
      },
      metadata: {
        autoGenerate: true,
        complexity: 2,
        preferredTempo: 120,
        swingRatio: 0.67
      }
    },
    {
      id: 'bebop-approach',
      name: 'Bebop Approach',
      pattern: {
        duration: 4,
        notePattern: [
          { degrees: [7], durations: [0.5] },
          { degrees: [1], durations: [0.5] },
          { degrees: [2], durations: [0.5] },
          { degrees: [3], durations: [0.5] },
          { degrees: [5], durations: [1] },
          { degrees: [3], durations: [1] }
        ]
      },
      metadata: {
        autoGenerate: true,
        complexity: 2,
        preferredTempo: 120,
        swingRatio: 0.67
      }
    }
  ]
}

export const validateTemplate = (template: ChordTemplateCollection[keyof ChordTemplateCollection][number]) => {
  const totalDuration = template.pattern.notePattern.reduce(
    (sum, note) => sum + note.durations[0],
    0
  )
  return totalDuration === template.pattern.duration
}

export const getActiveTemplates = () => {
  return Object.values(ChordTemplates)
    .flat()
    .filter(template => validateTemplate(template))
}

export default ChordTemplates 