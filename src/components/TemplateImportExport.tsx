'use client'

import { useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { exportTemplate, importTemplate } from '@/lib/templateExporter'

interface Props {
  onImport: (template: NoteTemplate | RhythmTemplate, type: 'note' | 'rhythm') => void
  onClose: () => void
}

export default function TemplateImportExport({ onImport, onClose }: Props) {
  const [importError, setImportError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const imported = importTemplate(text)
      onImport(imported.data, imported.type)
      onClose()
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import template')
    }
  }

  const handleExportTemplate = (template: NoteTemplate | RhythmTemplate, type: 'note' | 'rhythm') => {
    const exported = exportTemplate(template, type, 'Exported Template', 'custom')
    const blob = new Blob([exported], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `template-${type}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-white">Import/Export Templates</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>

      {/* Import Section */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Import Template</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-gray-700 file:text-white
            hover:file:bg-gray-600"
        />
        {importError && (
          <p className="text-xs text-red-400">{importError}</p>
        )}
      </div>
    </div>
  )
} 