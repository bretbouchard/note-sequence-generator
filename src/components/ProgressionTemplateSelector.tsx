'use client'

import { useState } from 'react'
import ProgressionTemplates from '@/data/ProgressionTemplates'
import type { ProgressionTemplateRule } from '@/types/templates'

type Props = {
  onTemplateSelect: (template: ProgressionTemplateRule) => void
  currentTemplate?: string
}

export function ProgressionTemplateSelector({ onTemplateSelect, currentTemplate }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic')

  return (
    <div className="flex flex-col gap-4">
      {/* Category Selection */}
      <div className="flex gap-2">
        {Object.keys(ProgressionTemplates).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-4">
        {ProgressionTemplates[selectedCategory].map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`p-4 rounded-lg border text-left ${
              currentTemplate === template.id
                ? 'border-indigo-500 bg-indigo-900/20'
                : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <h3 className="font-medium text-white">{template.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{template.description}</p>
            <div className="text-xs text-gray-500 mt-2">
              Rule: {template.pattern.applyRule}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 