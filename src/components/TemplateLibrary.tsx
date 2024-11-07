'use client'

import { useState } from 'react'
import { useTemplates } from '@/hooks/useTemplates'
import type { TemplateCategory } from '@/lib/templateService'

export default function TemplateLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('basic')
  const { noteTemplates, rhythmTemplates, loadTemplates, saveTemplate, deleteTemplate, isLoading, error } = useTemplates()

  const categories: Record<TemplateCategory, string> = {
    basic: 'Basic',
    jazz: 'Jazz',
    latin: 'Latin',
    custom: 'Custom'
  }

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div className="flex gap-2">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedCategory(key as TemplateCategory)
              loadTemplates(key as TemplateCategory)
            }}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-gray-400 text-sm">Loading templates...</div>
      )}
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {/* Note Templates */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Note Templates</h3>
        <div className="grid gap-2">
          {noteTemplates.map(template => (
            <div
              key={template.id}
              className="p-3 bg-gray-800 rounded-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-white">
                    Scale Degrees: {template.scaleDegrees.join(', ')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Weights: {template.weights.join(', ')}
                  </div>
                </div>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rhythm Templates */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Rhythm Templates</h3>
        <div className="grid gap-2">
          {rhythmTemplates.map(template => (
            <div
              key={template.id}
              className="p-3 bg-gray-800 rounded-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-white">
                    Durations: {template.durations.join(', ')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Template Duration: {template.templateDuration} bars
                  </div>
                </div>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 