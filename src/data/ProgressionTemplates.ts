import { ProgressionTemplateCollection } from '@/types/templates'
import ChordTemplates from './ChordTemplates'

const ProgressionTemplates: ProgressionTemplateCollection = {
  basic: [
    {
      id: 'basic-sequence',
      name: 'Basic Sequence',
      description: 'Apply templates sequentially through the progression',
      pattern: {
        templateIds: ['whole-note', 'half-notes', 'quarter-notes'],
        applyRule: 'sequential'
      }
    },
    {
      id: 'alternating',
      name: 'Alternating Pattern',
      description: 'Alternate between two templates',
      pattern: {
        templateIds: ['whole-note', 'half-notes'],
        applyRule: 'alternate'
      }
    }
  ],
  jazz: [
    {
      id: 'swing-pattern',
      name: 'Swing Pattern',
      description: 'Jazz swing feel with varied rhythms',
      pattern: {
        templateIds: ['swing-comp', 'swing-walk', 'swing-accent'],
        applyRule: 'sequential'
      }
    },
    {
      id: 'comp-pattern',
      name: 'Comping Pattern',
      description: 'Typical jazz comping rhythm',
      pattern: {
        templateIds: ['comp-basic', 'comp-syncopated'],
        applyRule: 'alternate'
      }
    }
  ],
  latin: [
    {
      id: 'montuno-basic',
      name: 'Basic Montuno',
      description: 'Simple Latin piano pattern',
      pattern: {
        templateIds: ['montuno-1', 'montuno-2'],
        applyRule: 'repeat',
        repeatCount: 2
      }
    },
    {
      id: 'salsa-pattern',
      name: 'Salsa Pattern',
      description: 'Complex Latin rhythm pattern',
      pattern: {
        templateIds: ['clave-3-2', 'clave-2-3'],
        applyRule: 'alternate'
      }
    }
  ]
}

export default ProgressionTemplates 