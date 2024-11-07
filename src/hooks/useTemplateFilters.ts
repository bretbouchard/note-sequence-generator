'use client'

import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface FilterOptions {
  category?: string
  duration?: number
  hasMetadata?: boolean
  tags?: string[]
}

export function useTemplateFilters() {
  const [filters, setFilters] = useState<FilterOptions>({})

  const filterTemplates = useCallback((
    templates: (NoteTemplate | RhythmTemplate)[]
  ) => {
    return templates.filter(template => {
      if (filters.category && template.category !== filters.category) {
        return false
      }
      if (filters.duration && template.repetition.duration !== filters.duration) {
        return false
      }
      // Add more filter conditions as needed
      return true
    })
  }, [filters])

  return {
    filters,
    setFilters,
    filterTemplates
  }
} 