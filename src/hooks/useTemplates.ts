import { useState, useEffect } from 'react'
import { templateService } from '@/lib/templateService'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import type { TemplateCategory } from '@/lib/templateService'

interface UseTemplatesReturn {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  loadTemplates: (category: TemplateCategory) => Promise<void>
  saveTemplate: (
    template: NoteTemplate | RhythmTemplate,
    type: 'note' | 'rhythm',
    name: string,
    category?: TemplateCategory
  ) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useTemplates(): UseTemplatesReturn {
  const [noteTemplates, setNoteTemplates] = useState<NoteTemplate[]>([])
  const [rhythmTemplates, setRhythmTemplates] = useState<RhythmTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial templates
  useEffect(() => {
    loadTemplates('basic')
  }, [])

  // Load templates by category
  const loadTemplates = async (category: TemplateCategory) => {
    setIsLoading(true)
    setError(null)
    try {
      // Load note templates
      const noteTemplatesResult = await templateService.loadTemplatesByCategory(category, 'note')
      setNoteTemplates(noteTemplatesResult.map(t => t.template as NoteTemplate))

      // Load rhythm templates
      const rhythmTemplatesResult = await templateService.loadTemplatesByCategory(category, 'rhythm')
      setRhythmTemplates(rhythmTemplatesResult.map(t => t.template as RhythmTemplate))

      // Load default templates if none exist
      if (category === 'basic' && noteTemplatesResult.length === 0) {
        const defaultNoteTemplates = templateService.getDefaultTemplates('note')
        setNoteTemplates(defaultNoteTemplates.map(t => t.template as NoteTemplate))
      }
      if (category === 'basic' && rhythmTemplatesResult.length === 0) {
        const defaultRhythmTemplates = templateService.getDefaultTemplates('rhythm')
        setRhythmTemplates(defaultRhythmTemplates.map(t => t.template as RhythmTemplate))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    } finally {
      setIsLoading(false)
    }
  }

  // Save template
  const saveTemplate = async (
    template: NoteTemplate | RhythmTemplate,
    type: 'note' | 'rhythm',
    name: string,
    category: TemplateCategory = 'custom'
  ) => {
    setError(null)
    try {
      await templateService.saveTemplate(template, type, name, category)
      await loadTemplates(category) // Reload templates after saving
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template')
    }
  }

  // Delete template
  const deleteTemplate = async (id: string) => {
    setError(null)
    try {
      await templateService.deleteTemplate(id)
      // Reload current templates
      await loadTemplates('custom') // Assuming deletion is only allowed for custom templates
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template')
    }
  }

  return {
    noteTemplates,
    rhythmTemplates,
    loadTemplates,
    saveTemplate,
    deleteTemplate,
    isLoading,
    error
  }
} 