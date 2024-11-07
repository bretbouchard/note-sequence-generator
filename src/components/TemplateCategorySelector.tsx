'use client'

import type { TemplateCategory } from '@/lib/templateOrganizer'

interface Props {
  selectedCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
}

export default function TemplateCategorySelector({
  selectedCategory,
  onCategoryChange
}: Props) {
  const categories: Record<TemplateCategory, string> = {
    basic: 'Basic',
    jazz: 'Jazz',
    latin: 'Latin',
    custom: 'Custom'
  }

  return (
    <div className="flex gap-2">
      {(Object.entries(categories) as [TemplateCategory, string][]).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onCategoryChange(key)}
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
  )
} 