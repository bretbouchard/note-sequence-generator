'use client'

import { useState } from 'react'
import type { ProgressionTemplateRule } from '@/types/templates'

interface Props {
  onTemplateSelect: (template: ProgressionTemplateRule) => void
}

export default function ProgressionTemplateSelector({ onTemplateSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'jazz' | 'latin'>('basic')

  const categories = {
    basic: 'Basic Patterns',
    jazz: 'Jazz Patterns',
    latin: 'Latin Patterns'
  }

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as 'basic' | 'jazz' | 'latin')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              selectedCategory === key
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Template List */}
      <div className="space-y-2">
        {/* Add your template list here based on selectedCategory */}
        {/* This is a placeholder - replace with actual templates */}
        <button
          onClick={() => onTemplateSelect({
            id: 'example',
            name: 'Example Template',
            description: 'Example description',
            pattern: {
              templateIds: ['1', '2'],
              applyRule: 'sequential'
            }
          })}
          className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 
                   text-sm text-white transition-colors"
        >
          <div className="font-medium">Example Template</div>
          <div className="text-xs text-gray-400 mt-1">
            Example description
          </div>
        </button>
      </div>
    </div>
  )
} 