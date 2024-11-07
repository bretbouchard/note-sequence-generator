'use client'

import { useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { organizeTemplates, type TemplateCategory } from '@/lib/templateOrganizer'
import TemplateCategorySelector from './TemplateCategorySelector'

interface Props {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  onTemplateSelect: (template: NoteTemplate | RhythmTemplate, type: 'note' | 'rhythm') => void
}

export default function TemplateOrganizer({
  noteTemplates,
  rhythmTemplates,
  onTemplateSelect
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('basic')
  const organized = organizeTemplates(noteTemplates, rhythmTemplates)

  return (
    <div className="space-y-6">
      <TemplateCategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Note Templates */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Note Templates</h3>
        <div className="grid gap-2">
          {organized.note[selectedCategory].map(template => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template, 'note')}
              className="p-3 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer"
            >
              <div className="text-sm text-white">
                Scale Degrees: {template.scaleDegrees.join(', ')}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Duration: {template.repetition.duration} bars
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rhythm Templates */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Rhythm Templates</h3>
        <div className="grid gap-2">
          {organized.rhythm[selectedCategory].map(template => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template, 'rhythm')}
              className="p-3 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer"
            >
              <div className="text-sm text-white">
                Durations: {template.durations.join(', ')}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Duration: {template.repetition.duration} bars
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 