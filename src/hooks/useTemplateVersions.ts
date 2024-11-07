'use client'

import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { createVersionedTemplate, addTemplateVersion, revertToVersion, compareVersions } from '@/lib/templateVersioning'

export function useTemplateVersions() {
  const [versionedTemplates, setVersionedTemplates] = useState<Record<string, any>>({})

  // Track a new template
  const trackTemplate = useCallback((
    template: NoteTemplate | RhythmTemplate,
    type: 'note' | 'rhythm'
  ) => {
    setVersionedTemplates(prev => ({
      ...prev,
      [template.id]: createVersionedTemplate(template, type)
    }))
  }, [])

  // Update template version
  const updateTemplate = useCallback((
    oldTemplate: NoteTemplate | RhythmTemplate,
    newTemplate: NoteTemplate | RhythmTemplate,
    type: 'note' | 'rhythm'
  ) => {
    setVersionedTemplates(prev => {
      const versionedTemplate = prev[oldTemplate.id]
      if (!versionedTemplate) {
        return {
          ...prev,
          [newTemplate.id]: createVersionedTemplate(newTemplate, type)
        }
      }

      const changes = compareVersions(oldTemplate, newTemplate)
      return {
        ...prev,
        [oldTemplate.id]: addTemplateVersion(versionedTemplate, newTemplate, changes)
      }
    })
  }, [])

  // Revert template to specific version
  const revertTemplate = useCallback((templateId: string, version: number) => {
    setVersionedTemplates(prev => {
      const versionedTemplate = prev[templateId]
      if (!versionedTemplate) return prev

      const reverted = revertToVersion(versionedTemplate, version)
      if (!reverted) return prev

      return {
        ...prev,
        [templateId]: reverted
      }
    })
  }, [])

  // Get version history for a template
  const getVersionHistory = useCallback((templateId: string) => {
    return versionedTemplates[templateId]?.versions || []
  }, [versionedTemplates])

  // Get current version of a template
  const getCurrentVersion = useCallback((templateId: string) => {
    const template = versionedTemplates[templateId]
    if (!template) return null

    const currentVersion = template.versions.find(
      (v: any) => v.version === template.currentVersion
    )
    return currentVersion?.data || null
  }, [versionedTemplates])

  return {
    trackTemplate,
    updateTemplate,
    revertTemplate,
    getVersionHistory,
    getCurrentVersion
  }
} 