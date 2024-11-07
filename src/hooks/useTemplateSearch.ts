'use client'

import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

export function useTemplateSearch() {
  const [searchTerm, setSearchTerm] = useState('')

  const searchTemplates = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[],
    type: 'note' | 'rhythm'
  ) => {
    if (!searchTerm) return templates

    return templates.filter(template => {
      const searchString = type === 'note'
        ? (template as NoteTemplate).scaleDegrees.join(',')
        : (template as RhythmTemplate).durations.join(',')

      return searchString.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [searchTerm])

  return {
    searchTerm,
    setSearchTerm,
    searchTemplates
  }
} 