'use client'

import { useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { exportTemplates, importTemplates } from '@/lib/templateExportImport'

interface Props {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  onImport: (noteTemplates: NoteTemplate[], rhythmTemplates: RhythmTemplate[]) => void
  onClose: () => void
}

export default function TemplateExportImportDialog({
  noteTemplates,
  rhythmTemplates,
  onImport,
  onClose
}: Props) {
  const [exportName, setExportName] = useState('')
  const [exportDescription, setExportDescription] = useState('')
  const [importError, setImportError] = useState<string | null>(null)

  const handleExport = () => {
    try {
      const exportData = exportTemplates(
        noteTemplates,
        rhythmTemplates,
        exportName,
        exportDescription
      )

      // Create and trigger download
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `templates-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      setImportError('Failed to export templates')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const imported = importTemplates(text)
      onImport(imported.templates.note, imported.templates.rhythm)
      onClose()
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import templates')
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Import/Export Templates</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>

      {/* Export Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-200">Export Templates</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Export name"
            value={exportName}
            onChange={(e) => setExportName(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={exportDescription}
            onChange={(e) => setExportDescription(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm h-24"
          />
          <button
            onClick={handleExport}
            disabled={!exportName}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 
                     disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Export Templates
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-200">Import Templates</h3>
        <div className="space-y-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-gray-700 file:text-white
              hover:file:bg-gray-600"
          />
          {importError && (
            <p className="text-sm text-red-400">{importError}</p>
          )}
        </div>
      </div>
    </div>
  )
} 