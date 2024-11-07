'use client'

import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface TemplateMetadata {
  name: string
  description: string
  tags: string[]
  created: string
  modified: string
}

export function useTemplateMetadata() {
  const [metadata, setMetadata] = useState<Record<string, TemplateMetadata>>({})

  const updateMetadata = useCallback((
    templateId: string,
    updates: Partial<TemplateMetadata>
  ) => {
    setMetadata(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        ...updates,
        modified: new Date().toISOString()
      }
    }))
  }, [])

  const getMetadata = useCallback((templateId: string): TemplateMetadata => {
    return metadata[templateId] || {
      name: '',
      description: '',
      tags: [],
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  }, [metadata])

  return {
    metadata,
    updateMetadata,
    getMetadata
  }
} 