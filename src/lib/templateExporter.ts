import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface ExportedTemplate {
  version: string
  type: 'note' | 'rhythm'
  data: NoteTemplate | RhythmTemplate
  metadata: {
    name: string
    category: string
    created: string
    modified: string
  }
}

export const exportTemplate = (
  template: NoteTemplate | RhythmTemplate,
  type: 'note' | 'rhythm',
  name: string,
  category: string
): string => {
  const exportData: ExportedTemplate = {
    version: '1.0',
    type,
    data: template,
    metadata: {
      name,
      category,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  }

  return JSON.stringify(exportData, null, 2)
}

export const importTemplate = (jsonString: string): ExportedTemplate => {
  try {
    const data = JSON.parse(jsonString)
    if (!data.version || !data.type || !data.data) {
      throw new Error('Invalid template format')
    }
    return data
  } catch (error) {
    throw new Error('Failed to parse template file')
  }
} 