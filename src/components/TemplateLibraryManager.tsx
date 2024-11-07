'use client'

import { useState, useEffect } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import type { TemplateCategory } from '@/lib/templateService'
import { useTemplates } from '@/hooks/useTemplates'

interface Props {
  onTemplateSelect: (template: NoteTemplate | RhythmTemplate) => void
}

export default function TemplateLibraryManager({ onTemplateSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('basic')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'note' | 'rhythm'>('all')
  const { noteTemplates, rhythmTemplates, loadTemplates, saveTemplate, deleteTemplate, isLoading, error } = useTemplates()

  const categories: Record<TemplateCategory, string> = {
    basic: 'Basic',
    jazz: 'Jazz',
    latin: 'Latin',
    custom: 'Custom'
  }

  // Filter templates based on search and type
  const filteredTemplates = {
    note: noteTemplates.filter(template => {
      const matchesSearch = searchTerm === '' || 
        template.scaleDegrees.join(',').includes(searchTerm)
      return filterType === 'all' || filterType === 'note' ? matchesSearch : false
    }),
    rhythm: rhythmTemplates.filter(template => {
      const matchesSearch = searchTerm === '' || 
        template.durations.join(',').includes(searchTerm)
      return filterType === 'all' || filterType === 'rhythm' ? matchesSearch : false
    })
  }

  // Template list section with enhanced organization
  const TemplateList = ({ type, templates }: { 
    type: 'note' | 'rhythm', 
    templates: (NoteTemplate | RhythmTemplate)[] 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-white">
          {type === 'note' ? 'Note' : 'Rhythm'} Templates
        </h3>
        <span className="text-xs text-gray-400">
          {templates.length} templates
        </span>
      </div>
      <div className="grid gap-2">
        {templates.map(template => (
          <div
            key={template.id}
            className="p-3 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer"
            onClick={() => onTemplateSelect(template)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-white">
                  {type === 'note'
                    ? `Notes: ${(template as NoteTemplate).scaleDegrees.join(', ')}`
                    : `Rhythm: ${(template as RhythmTemplate).durations.join(', ')}`}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {selectedCategory} • {template.repetition.duration} bars
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTemplate(template.id)
                  }}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded text-sm ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('note')}
            className={`px-3 py-1 rounded text-sm ${
              filterType === 'note'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setFilterType('rhythm')}
            className={`px-3 py-1 rounded text-sm ${
              filterType === 'rhythm'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rhythms
          </button>
        </div>
      </div>

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

      {/* Template Lists */}
      <div className="space-y-6">
        <TemplateList type="note" templates={filteredTemplates.note} />
        <TemplateList type="rhythm" templates={filteredTemplates.rhythm} />
      </div>
    </div>
  )
} 