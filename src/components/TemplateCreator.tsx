'use client'

import { useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  type: 'note' | 'rhythm'
  onSave: (template: NoteTemplate | RhythmTemplate) => void
  onSaveAsPreset?: (template: NoteTemplate | RhythmTemplate) => void
  onCancel: () => void
}

export default function TemplateCreator({ type, onSave, onSaveAsPreset, onCancel }: Props) {
  const [template, setTemplate] = useState(() => {
    if (type === 'note') {
      return {
        id: `note-${Date.now()}`,
        scaleDegrees: [1],
        weights: [1],
        repetition: {
          startBar: 0,
          duration: 1
        }
      } as NoteTemplate
    } else {
      return {
        id: `rhythm-${Date.now()}`,
        durations: [1],
        templateDuration: 1,
        repetition: {
          startBar: 0,
          duration: 1
        }
      } as RhythmTemplate
    }
  })

  const handleSave = () => {
    onSave(template)
  }

  const handleSaveAsPreset = () => {
    if (onSaveAsPreset) {
      onSaveAsPreset(template)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-white">
          Create New {type === 'note' ? 'Note' : 'Rhythm'} Template
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500"
          >
            Save
          </button>
          {onSaveAsPreset && (
            <button
              onClick={handleSaveAsPreset}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-500"
            >
              Save as Preset
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      {type === 'note' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Scale Degrees</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={(template as NoteTemplate).scaleDegrees.join(', ')}
                onChange={(e) => setTemplate({
                  ...template,
                  scaleDegrees: e.target.value.split(',').map(n => parseInt(n.trim()))
                } as NoteTemplate)}
                className="flex-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
                placeholder="1, 2, 3, 4, 5"
              />
              <button
                onClick={() => setTemplate(prev => ({
                  ...prev,
                  scaleDegrees: [...(prev as NoteTemplate).scaleDegrees, 1],
                  weights: [...(prev as NoteTemplate).weights, 1]
                }))}
                className="px-2 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Weights</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={(template as NoteTemplate).weights.join(', ')}
                onChange={(e) => setTemplate({
                  ...template,
                  weights: e.target.value.split(',').map(n => parseFloat(n.trim()))
                } as NoteTemplate)}
                className="flex-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
                placeholder="1, 1, 1, 1, 1"
              />
            </div>
          </div>
        </div>
      )}

      {type === 'rhythm' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Durations</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={(template as RhythmTemplate).durations.join(', ')}
                onChange={(e) => setTemplate({
                  ...template,
                  durations: e.target.value.split(',').map(n => parseFloat(n.trim()))
                } as RhythmTemplate)}
                className="flex-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
                placeholder="1, 1, 1, 1"
              />
              <button
                onClick={() => setTemplate(prev => ({
                  ...prev,
                  durations: [...(prev as RhythmTemplate).durations, 1]
                }))}
                className="px-2 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Template Duration (bars)</label>
            <input
              type="number"
              value={(template as RhythmTemplate).templateDuration}
              onChange={(e) => setTemplate({
                ...template,
                templateDuration: parseFloat(e.target.value)
              } as RhythmTemplate)}
              className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
              min="0.5"
              step="0.5"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Start Bar</label>
          <input
            type="number"
            value={template.repetition.startBar}
            onChange={(e) => setTemplate({
              ...template,
              repetition: {
                ...template.repetition,
                startBar: parseInt(e.target.value)
              }
            })}
            className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Duration (bars)</label>
          <input
            type="number"
            value={template.repetition.duration}
            onChange={(e) => setTemplate({
              ...template,
              repetition: {
                ...template.repetition,
                duration: parseInt(e.target.value)
              }
            })}
            className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
            min="1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onSaveAsPreset && (
          <button
            onClick={handleSaveAsPreset}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-500"
          >
            Save as Preset
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  )
} 