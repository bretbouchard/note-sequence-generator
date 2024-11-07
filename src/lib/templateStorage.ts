'use client'

import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface StoredTemplateData {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  lastUpdated: string
}

const STORAGE_KEY = 'template_data'

export function saveTemplates(noteTemplates: NoteTemplate[], rhythmTemplates: RhythmTemplate[]) {
  try {
    const data: StoredTemplateData = {
      noteTemplates,
      rhythmTemplates,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save templates:', error)
    return false
  }
}

export function loadTemplates(): StoredTemplateData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const data = JSON.parse(stored)
    return {
      noteTemplates: data.noteTemplates || [],
      rhythmTemplates: data.rhythmTemplates || [],
      lastUpdated: data.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to load templates:', error)
    return null
  }
}

export function clearStoredTemplates() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear templates:', error)
    return false
  }
} 