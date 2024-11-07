'use client'

import type { FilterOptions } from '@/hooks/useTemplateFilters'

interface Props {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

export default function TemplateFilterPanel({
  filters,
  onFilterChange
}: Props) {
  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      <h3 className="text-sm font-medium text-white">Filter Templates</h3>

      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
        >
          <option value="">All Categories</option>
          <option value="basic">Basic</option>
          <option value="jazz">Jazz</option>
          <option value="latin">Latin</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Duration (bars)</label>
        <select
          value={filters.duration || ''}
          onChange={(e) => onFilterChange({ ...filters, duration: Number(e.target.value) || undefined })}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
        >
          <option value="">Any Duration</option>
          <option value="1">1 Bar</option>
          <option value="2">2 Bars</option>
          <option value="4">4 Bars</option>
          <option value="8">8 Bars</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.hasMetadata}
          onChange={(e) => onFilterChange({ ...filters, hasMetadata: e.target.checked })}
          className="bg-gray-700 rounded"
        />
        <label className="text-sm text-gray-300">Has metadata</label>
      </div>
    </div>
  )
} 