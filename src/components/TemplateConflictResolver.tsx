'use client'

import { useState, useEffect } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { useTemplateConflicts } from '@/hooks/useTemplateConflicts'
import { useTemplateSync } from '@/hooks/useTemplateSync'

interface Props {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  totalBars: number
  onResolve: (
    resolvedNoteTemplates: NoteTemplate[],
    resolvedRhythmTemplates: RhythmTemplate[]
  ) => void
}

export default function TemplateConflictResolver({
  noteTemplates,
  rhythmTemplates,
  totalBars,
  onResolve
}: Props) {
  const { findOverlaps, findGaps, findBoundaryIssues, resolveConflicts } = useTemplateConflicts()
  const { validateSync } = useTemplateSync()
  const [conflicts, setConflicts] = useState<{
    errors: string[]
    warnings: string[]
  }>({ errors: [], warnings: [] })

  // Check for conflicts when templates change
  useEffect(() => {
    const result = validateSync(noteTemplates, rhythmTemplates, totalBars)
    setConflicts({
      errors: result.errors,
      warnings: result.warnings
    })
  }, [noteTemplates, rhythmTemplates, totalBars, validateSync])

  // Auto-resolve all conflicts
  const handleAutoResolve = () => {
    const resolvedNoteTemplates = resolveConflicts(noteTemplates, totalBars) as NoteTemplate[]
    const resolvedRhythmTemplates = resolveConflicts(rhythmTemplates, totalBars) as RhythmTemplate[]
    onResolve(resolvedNoteTemplates, resolvedRhythmTemplates)
  }

  // Ignore warnings and proceed
  const handleIgnoreWarnings = () => {
    onResolve(noteTemplates, rhythmTemplates)
  }

  if (conflicts.errors.length === 0 && conflicts.warnings.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      {/* Error Messages */}
      {conflicts.errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-400">
            Template Errors ({conflicts.errors.length})
          </h4>
          <ul className="space-y-1">
            {conflicts.errors.map((error, index) => (
              <li key={index} className="text-sm text-red-300 flex items-start gap-2">
                <span className="text-red-400">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warning Messages */}
      {conflicts.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yellow-400">
            Template Warnings ({conflicts.warnings.length})
          </h4>
          <ul className="space-y-1">
            {conflicts.warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-300 flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resolution Actions */}
      <div className="flex gap-2 pt-2">
        {conflicts.errors.length > 0 && (
          <button
            onClick={handleAutoResolve}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
          >
            Auto-resolve All
          </button>
        )}
        {conflicts.errors.length === 0 && conflicts.warnings.length > 0 && (
          <button
            onClick={handleIgnoreWarnings}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          >
            Ignore Warnings
          </button>
        )}
      </div>

      {/* Resolution Preview */}
      {conflicts.errors.length > 0 && (
        <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
          <p className="font-medium mb-2">Auto-resolve will:</p>
          <ul className="space-y-1 text-sm">
            <li>• Adjust template positions to eliminate overlaps</li>
            <li>• Fix templates extending beyond sequence length</li>
            <li>• Ensure proper template durations</li>
          </ul>
        </div>
      )}
    </div>
  )
} 