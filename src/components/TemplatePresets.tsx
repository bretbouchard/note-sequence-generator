'use client'

import { useState, useEffect } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  type: 'note' | 'rhythm'
  onLoadTemplate: (template: NoteTemplate | RhythmTemplate) => void
}

export default function TemplatePresets({ type, onLoadTemplate }: Props) {
  const [presets, setPresets] = useState<(NoteTemplate | RhythmTemplate)[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')

  // Load presets from localStorage
  useEffect(() => {
    const storedPresets = localStorage.getItem(`${type}Templates`)
    if (storedPresets) {
      setPresets(JSON.parse(storedPresets))
    }
  }, [type])

  // Save preset
  const savePreset = async (template: NoteTemplate | RhythmTemplate) => {
    const updatedPresets = [...presets, template]
    setPresets(updatedPresets)
    localStorage.setItem(`${type}Templates`, JSON.stringify(updatedPresets))
  }

  // Load preset
  const handleLoadPreset = () => {
    const preset = presets.find(p => p.id === selectedPreset)
    if (preset) {
      onLoadTemplate(preset)
    }
  }

  // Delete preset
  const handleDeletePreset = (id: string) => {
    const updatedPresets = presets.filter(p => p.id !== id)
    setPresets(updatedPresets)
    localStorage.setItem(`${type}Templates`, JSON.stringify(updatedPresets))
    if (selectedPreset === id) {
      setSelectedPreset('')
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">
        {type === 'note' ? 'Note' : 'Rhythm'} Template Presets
      </h3>

      {/* Preset Selection */}
      <div className="flex gap-2">
        <select
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
        >
          <option value="">Select a preset</option>
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {type === 'note' 
                ? `Notes: ${(preset as NoteTemplate).scaleDegrees.join(', ')}` 
                : `Rhythm: ${(preset as RhythmTemplate).durations.join(', ')}`}
            </option>
          ))}
        </select>
        <button
          onClick={handleLoadPreset}
          disabled={!selectedPreset}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm
                   hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          Load
        </button>
      </div>

      {/* Preset List */}
      <div className="space-y-2">
        {presets.map(preset => (
          <div 
            key={preset.id}
            className="flex justify-between items-center p-2 bg-gray-800 rounded"
          >
            <span className="text-sm text-gray-300">
              {type === 'note'
                ? (preset as NoteTemplate).scaleDegrees.join(', ')
                : (preset as RhythmTemplate).durations.join(', ')}
            </span>
            <button
              onClick={() => handleDeletePreset(preset.id)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 