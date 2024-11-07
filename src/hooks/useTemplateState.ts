'use client'

import { useState, useEffect, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { saveTemplates, loadTemplates } from '@/lib/templateStorage'
import { useTemplateFeedback } from './useTemplateFeedback'

export function useTemplateState() {
  const [noteTemplates, setNoteTemplates] = useState<NoteTemplate[]>([])
  const [rhythmTemplates, setRhythmTemplates] = useState<RhythmTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addFeedback } = useTemplateFeedback()

  // Load templates on mount
  useEffect(() => {
    const stored = loadTemplates()
    if (stored) {
      setNoteTemplates(stored.noteTemplates)
      setRhythmTemplates(stored.rhythmTemplates)
      addFeedback('success', 'Templates loaded successfully')
    }
    setIsLoading(false)
  }, [addFeedback])

  // Save templates when they change
  useEffect(() => {
    if (!isLoading) {
      const success = saveTemplates(noteTemplates, rhythmTemplates)
      if (!success) {
        addFeedback('error', 'Failed to save templates')
      }
    }
  }, [noteTemplates, rhythmTemplates, isLoading, addFeedback])

  // Template operations
  const addTemplate = useCallback((template: NoteTemplate | RhythmTemplate, type: 'note' | 'rhythm') => {
    if (type === 'note') {
      setNoteTemplates(prev => [...prev, template as NoteTemplate])
    } else {
      setRhythmTemplates(prev => [...prev, template as RhythmTemplate])
    }
    addFeedback('success', 'Template added successfully')
  }, [addFeedback])

  const updateTemplate = useCallback((
    templateId: string,
    updates: Partial<NoteTemplate | RhythmTemplate>,
    type: 'note' | 'rhythm'
  ) => {
    if (type === 'note') {
      setNoteTemplates(prev => 
        prev.map(t => t.id === templateId ? { ...t, ...updates } : t)
      )
    } else {
      setRhythmTemplates(prev => 
        prev.map(t => t.id === templateId ? { ...t, ...updates } : t)
      )
    }
    addFeedback('success', 'Template updated successfully')
  }, [addFeedback])

  const deleteTemplate = useCallback((templateId: string, type: 'note' | 'rhythm') => {
    if (type === 'note') {
      setNoteTemplates(prev => prev.filter(t => t.id !== templateId))
    } else {
      setRhythmTemplates(prev => prev.filter(t => t.id !== templateId))
    }
    addFeedback('success', 'Template deleted successfully')
  }, [addFeedback])

  return {
    noteTemplates,
    rhythmTemplates,
    isLoading,
    addTemplate,
    updateTemplate,
    deleteTemplate
  }
} 