'use client'

import { useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { useTemplateVersions } from '@/hooks/useTemplateVersions'
import TemplateVersionHistory from './TemplateVersionHistory'

interface Props {
  template: NoteTemplate | RhythmTemplate
  type: 'note' | 'rhythm'
  onUpdate: (template: NoteTemplate | RhythmTemplate) => void
  onClose: () => void
}

export default function TemplateVersionManager({ template, type, onUpdate, onClose }: Props) {
  const {
    trackTemplate,
    updateTemplate,
    revertTemplate,
    getVersionHistory,
    getCurrentVersion
  } = useTemplateVersions()

  const [showHistory, setShowHistory] = useState(false)

  // Initialize version tracking if not already tracked
  useState(() => {
    trackTemplate(template, type)
  }, [template.id])

  const handleUpdate = (updatedTemplate: NoteTemplate | RhythmTemplate) => {
    updateTemplate(template, updatedTemplate, type)
    onUpdate(updatedTemplate)
  }

  const handleRevert = (version: number) => {
    const revertedTemplate = getCurrentVersion(template.id)
    if (revertedTemplate) {
      revertTemplate(template.id, version)
      onUpdate(revertedTemplate)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-white">Template Version Control</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
          >
            View History
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>

      {showHistory && (
        <TemplateVersionHistory
          versionedTemplate={{
            id: template.id,
            type,
            currentVersion: 1,
            versions: getVersionHistory(template.id)
          }}
          onRevert={handleRevert}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
} 