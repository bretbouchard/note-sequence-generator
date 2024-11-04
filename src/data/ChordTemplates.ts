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
      }
    }
  ]
}

export default ChordTemplates 