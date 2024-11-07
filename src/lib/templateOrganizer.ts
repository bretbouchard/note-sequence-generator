'use client'

import type { NoteTemplate, RhythmTemplate } from '@/types/music'

export type TemplateCategory = 'basic' | 'jazz' | 'latin' | 'custom'

interface OrganizedTemplates {
  note: Record<TemplateCategory, NoteTemplate[]>
  rhythm: Record<TemplateCategory, RhythmTemplate[]>
}

export function organizeTemplates(
  noteTemplates: NoteTemplate[],
  rhythmTemplates: RhythmTemplate[]
): OrganizedTemplates {
  const organized: OrganizedTemplates = {
    note: {
      basic: [],
      jazz: [],
      latin: [],
      custom: []
    },
    rhythm: {
      basic: [],
      jazz: [],
      latin: [],
      custom: []
    }
  }

  // Organize note templates
  noteTemplates.forEach(template => {
    const category = template.category as TemplateCategory || 'custom'
    organized.note[category].push(template)
  })

  // Organize rhythm templates
  rhythmTemplates.forEach(template => {
    const category = template.category as TemplateCategory || 'custom'
    organized.rhythm[category].push(template)
  })

  return organized
} 