'use client'

import { useState } from 'react'
import type { ChordTemplate } from '@/types/templates'

interface Props {
  templates: Record<string, ChordTemplate[]>
  onTemplateSelect: (template: ChordTemplate) => void
}

export default function ChordTemplateSelector({ templates, onTemplateSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(templates)[0]
  )

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm"
      >
        {Object.keys(templates).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Template List */}
      <div className="space-y-2">
        {templates[selectedCategory]?.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 
                     text-sm text-white transition-colors"
          >
            <div className="font-medium">{template.name}</div>
            {template.description && (
              <div className="text-xs text-gray-400 mt-1">
                {template.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 