'use client'

import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface ExportedTemplateData {
  version: string
  templates: {
    note: NoteTemplate[]
    rhythm: RhythmTemplate[]
  }
  metadata: {
    name: string
    description: string
    created: string
    modified: string
  }
}

export const exportTemplates = (
  noteTemplates: NoteTemplate[],
  rhythmTemplates: RhythmTemplate[],
  name: string,
  description: string = ''
): string => {
  const exportData: ExportedTemplateData = {
    version: '1.0',
    templates: {
      note: noteTemplates,
      rhythm: rhythmTemplates
    },
    metadata: {
      name,
      description,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  }

  return JSON.stringify(exportData, null, 2)
}

export const importTemplates = (jsonString: string): ExportedTemplateData => {
  try {
    const data = JSON.parse(jsonString)
    validateImportedData(data)
    return data
  } catch (error) {
    throw new Error(`Invalid template file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function validateImportedData(data: any): asserts data is ExportedTemplateData {
  if (!data.version || !data.templates || !data.metadata) {
    throw new Error('Missing required fields')
  }

  if (!data.templates.note || !Array.isArray(data.templates.note)) {
    throw new Error('Invalid note templates')
  }

  if (!data.templates.rhythm || !Array.isArray(data.templates.rhythm)) {
    throw new Error('Invalid rhythm templates')
  }

  // Validate each note template
  data.templates.note.forEach((template: any, index: number) => {
    if (!template.id || !template.scaleDegrees || !template.weights || !template.repetition) {
      throw new Error(`Invalid note template at index ${index}`)
    }
  })

  // Validate each rhythm template
  data.templates.rhythm.forEach((template: any, index: number) => {
    if (!template.id || !template.durations || !template.templateDuration || !template.repetition) {
      throw new Error(`Invalid rhythm template at index ${index}`)
    }
  })
} 