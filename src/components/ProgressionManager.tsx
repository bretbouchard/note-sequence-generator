'use client'

import { useState } from 'react'
import type { ChordProgressionData } from '@/types/music'
import { createProgression, updateProgression, deleteProgression } from '@/lib/progressions'

type Props = {
  progression?: ChordProgressionData
  onSave?: () => void
  onDelete?: () => void
}

export function ProgressionManager({ progression, onSave, onDelete }: Props) {
  const [name, setName] = useState(progression?.name || '')
  const [chords, setChords] = useState(progression?.chords || [])
  const [isEditing, setIsEditing] = useState(!progression)

  const handleSave = async () => {
    try {
      if (progression) {
        await updateProgression(progression.id, { name, chords })
      } else {
        await createProgression({ name, chords })
      }
      onSave?.()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save progression:', error)
    }
  }

  const handleDelete = async () => {
    if (!progression) return
    try {
      await deleteProgression(progression.id)
      onDelete?.()
    } catch (error) {
      console.error('Failed to delete progression:', error)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">
          {progression ? 'Edit Progression' : 'New Progression'}
        </h3>
        <div className="flex gap-2">
          {progression && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-indigo-600 text-white rounded-md"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Progression Name"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
          />
          {/* Add chord editing UI here */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-600 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-gray-300 mb-2">{progression?.name}</div>
          <div className="flex gap-2 flex-wrap">
            {progression?.chords.map((chord) => (
              <div
                key={chord.id}
                className="px-3 py-2 bg-gray-700 rounded-md text-gray-300"
              >
                {chord.degree}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 