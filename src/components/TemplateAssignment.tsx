'use client'

import { useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  sequenceLength: number
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  onAssignTemplate: (type: 'note' | 'rhythm', templateId: string, startBar: number) => void
}

export default function TemplateAssignment({ 
  sequenceLength, 
  noteTemplates, 
  rhythmTemplates,
  onAssignTemplate 
}: Props) {
  const [selectedType, setSelectedType] = useState<'note' | 'rhythm'>('note')
  const [selectedBar, setSelectedBar] = useState(0)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

  const handleAssign = () => {
    if (selectedTemplateId) {
      onAssignTemplate(selectedType, selectedTemplateId, selectedBar)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      <h3 className="text-sm font-medium text-white">Assign Template</h3>
      
      {/* Template Type Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedType('note')}
          className={`px-3 py-1 rounded text-sm ${
            selectedType === 'note' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Note Template
        </button>
        <button
          onClick={() => setSelectedType('rhythm')}
          className={`px-3 py-1 rounded text-sm ${
            selectedType === 'rhythm' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Rhythm Template
        </button>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Template</label>
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
        >
          <option value="">Select a template</option>
          {(selectedType === 'note' ? noteTemplates : rhythmTemplates).map(template => (
            <option key={template.id} value={template.id}>
              {selectedType === 'note' 
                ? `Notes: ${(template as NoteTemplate).scaleDegrees.join(', ')}` 
                : `Rhythm: ${(template as RhythmTemplate).durations.join(', ')}`}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Selection */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Start Bar</label>
        <input
          type="number"
          min={0}
          max={sequenceLength - 1}
          value={selectedBar}
          onChange={(e) => setSelectedBar(parseInt(e.target.value))}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Bar Timeline Visualization */}
      <div className="flex gap-1 mt-2">
        {Array.from({ length: sequenceLength }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedBar(i)}
            className={`flex-1 h-8 rounded ${
              i === selectedBar
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Assign Button */}
      <button
        onClick={handleAssign}
        disabled={!selectedTemplateId}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm
                 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        Assign Template
      </button>
    </div>
  )
} 