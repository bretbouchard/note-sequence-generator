'use client'

import { useState } from 'react'
import type { TemplateMetadata } from '@/hooks/useTemplateMetadata'

interface Props {
  metadata: TemplateMetadata
  onUpdate: (updates: Partial<TemplateMetadata>) => void
  onClose: () => void
}

export default function TemplateMetadataEditor({
  metadata,
  onUpdate,
  onClose
}: Props) {
  const [name, setName] = useState(metadata.name)
  const [description, setDescription] = useState(metadata.description)
  const [tags, setTags] = useState(metadata.tags.join(', '))

  const handleSave = () => {
    onUpdate({
      name,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm h-24"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  )
} 