'use client'

import { useState } from 'react'
import ChordTemplates from '@/data/ChordTemplates'

type Props = {
  chordId: string
  currentTemplate?: string
  onTemplateSelect: (chordId: string, templateId: string) => void
}

export function ChordTemplateSelector({ chordId, currentTemplate, onTemplateSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic')

  const handleTemplateChange = (templateId: string) => {
    onTemplateSelect(chordId, templateId)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Category Selection */}
      <div className="flex gap-2">
        {Object.keys(ChordTemplates).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-2 py-1 text-sm rounded-md ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-2 gap-2">
        {ChordTemplates[selectedCategory].map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateChange(template.id)}
            className={`p-2 text-sm rounded-md border ${
              currentTemplate === template.id
                ? 'border-indigo-500 bg-indigo-900/20 text-indigo-300'
                : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
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

export default ChordTemplateSelector 