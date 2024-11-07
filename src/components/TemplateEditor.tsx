'use client'

import { useState, useEffect } from 'react'
import type { NoteTemplate, RhythmTemplate, PatternDirection, PatternBehavior } from '@/types/music'
import DraggableNote from './DraggableNote'

interface Props {
  type: 'note' | 'rhythm'
  template: NoteTemplate | RhythmTemplate
  onSave: (template: NoteTemplate | RhythmTemplate) => void
  onUpdate: (template: NoteTemplate | RhythmTemplate) => void
  onCancel: () => void
}

type DurationOption = {
  value: number
  label: string
}

const durationOptions: DurationOption[] = [
  { value: 0.25, label: '1/16' },
  { value: 0.5, label: '1/8' },
  { value: 1, label: '1/4' },
  { value: 2, label: '1/2' },
  { value: 4, label: '1' }
]

export default function TemplateEditor({ type, template, onSave, onUpdate, onCancel }: Props) {
  const [editedTemplate, setEditedTemplate] = useState<NoteTemplate | RhythmTemplate>(template)

  const updateTemplate = (newTemplate: NoteTemplate | RhythmTemplate) => {
    setEditedTemplate(newTemplate)
    onUpdate(newTemplate)
  }

  const handleDurationChange = (index: number, value: number) => {
    if (type === 'rhythm' && 'durations' in editedTemplate) {
      const newDurations = [...editedTemplate.durations]
      newDurations[index] = value
      updateTemplate({
        ...editedTemplate,
        durations: newDurations
      })
    }
  }

  const toggleRest = (index: number) => {
    if (type === 'rhythm' && 'durations' in editedTemplate) {
      const newRests = [...(editedTemplate.rests || editedTemplate.durations.map(() => false))]
      newRests[index] = !newRests[index]
      updateTemplate({
        ...editedTemplate,
        rests: newRests
      })
    }
  }

  const handleNoteChange = (index: number, value: number) => {
    if (type === 'note' && 'scaleDegrees' in editedTemplate) {
      const newTemplate = {
        ...editedTemplate,
        scaleDegrees: editedTemplate.scaleDegrees.map(
          (deg, i) => i === index ? value : deg
        )
      }
      updateTemplate(newTemplate)
    } else if (type === 'rhythm' && 'durations' in editedTemplate) {
      const newTemplate = {
        ...editedTemplate,
        durations: editedTemplate.durations.map(
          (dur, i) => i === index ? value : dur
        )
      }
      updateTemplate(newTemplate)
    }
  }

  const addStep = () => {
    if (type === 'note' && 'scaleDegrees' in editedTemplate) {
      const newTemplate = {
        ...editedTemplate,
        scaleDegrees: [...editedTemplate.scaleDegrees, 1],
        weights: [...editedTemplate.weights, 1]
      }
      updateTemplate(newTemplate)
    } else if (type === 'rhythm' && 'durations' in editedTemplate) {
      const newTemplate = {
        ...editedTemplate,
        durations: [...editedTemplate.durations, 1]
      }
      updateTemplate(newTemplate)
    }
  }

  const removeStep = (index: number) => {
    if (type === 'note' && 'scaleDegrees' in editedTemplate) {
      const newTemplate = {
        ...editedTemplate,
        scaleDegrees: editedTemplate.scaleDegrees.filter((_, i) => i !== index),
        weights: editedTemplate.weights.filter((_, i) => i !== index)
      }
      updateTemplate(newTemplate)
    } else if (type === 'rhythm' && 'durations' in editedTemplate) {
      const newTemplate = {
        ...editedTemplate,
        durations: editedTemplate.durations.filter((_, i) => i !== index)
      }
      updateTemplate(newTemplate)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      {/* Pattern Editor */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">
          Edit {type === 'note' ? 'Note' : 'Rhythm'} Template
        </h3>
        <button
          type="button"
          onClick={addStep}
          className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-500"
        >
          Add Step
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-4">
          {type === 'note' && 'scaleDegrees' in editedTemplate ? (
            editedTemplate.scaleDegrees.map((degree, index) => (
              <div key={index} className="relative">
                <DraggableNote
                  value={degree}
                  index={index}
                  min={1}
                  max={7}
                  onChange={handleNoteChange}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-500"
                >
                  ×
                </button>
              </div>
            ))
          ) : type === 'rhythm' && 'durations' in editedTemplate ? (
            editedTemplate.durations.map((duration, index) => (
              <div key={index} className="relative flex flex-col gap-1 items-center">
                <select
                  value={duration}
                  onChange={(e) => handleDurationChange(index, Number(e.target.value))}
                  className="w-20 bg-gray-700 text-white rounded px-2 py-1 text-sm"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => toggleRest(index)}
                  className={`px-2 py-1 text-xs rounded ${
                    editedTemplate.rests?.[index]
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Rest
                </button>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-500"
                >
                  ×
                </button>
              </div>
            ))
          ) : null}
        </div>
      </div>

      {/* Pattern Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Pattern Options</h4>
        
        {/* Pattern Direction - Only for Note Templates */}
        {type === 'note' && 'direction' in editedTemplate && (
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Direction</label>
            <div className="flex gap-2">
              {(['forward', 'backward', 'pingpong'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => updateTemplate({ ...editedTemplate, direction: dir })}
                  className={`px-3 py-1 text-sm rounded ${
                    editedTemplate.direction === dir
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {dir.charAt(0).toUpperCase() + dir.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Behavior */}
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Behavior</label>
          <div className="flex gap-2">
            {(['continuous', 'repeat-per-chord'] as const).map((behavior) => (
              <button
                key={behavior}
                type="button"
                onClick={() => updateTemplate({ ...editedTemplate, behavior })}
                className={`px-3 py-1 text-sm rounded ${
                  editedTemplate.behavior === behavior
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {behavior === 'continuous' ? 'Continuous' : 'Restart on Chord'}
              </button>
            ))}
          </div>
        </div>

        {/* Note Source - Only for Note Templates */}
        {type === 'note' && 'useChordTones' in editedTemplate && (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => updateTemplate({
                ...editedTemplate,
                useChordTones: !editedTemplate.useChordTones
              })}
              className={`px-3 py-1 text-sm rounded ${
                editedTemplate.useChordTones
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Chord Tones
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(editedTemplate)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  )
} 