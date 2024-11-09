'use client'

import { useState } from 'react'
import type { Chord, ChordType } from '@/types/progression'

interface Props {
  chord: Chord
  availableChordTypes: ChordType[]
  onUpdate: (chord: Chord) => void
  onDelete: () => void
}

export default function ChordEditor({ chord, availableChordTypes, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  const handleChordTypeChange = (chordType: string) => {
    onUpdate({
      ...chord,
      chordType,
      degree: `${chord.scaleDegree}${chordType}`
    })
  }

  const handleScaleDegreeChange = (scaleDegree: number) => {
    onUpdate({
      ...chord,
      scaleDegree,
      degree: `${scaleDegree}${chord.chordType}`
    })
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-4">
        {/* Scale Degree Selector */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400">Root</label>
          <select
            value={chord.scaleDegree}
            onChange={(e) => handleScaleDegreeChange(Number(e.target.value))}
            className="bg-gray-700 rounded px-2 py-1"
          >
            {[1, 2, 3, 4, 5, 6, 7].map(degree => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
        </div>

        {/* Chord Type Selector */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400">Type</label>
          <select
            value={chord.chordType}
            onChange={(e) => handleChordTypeChange(e.target.value)}
            className="bg-gray-700 rounded px-2 py-1"
          >
            {availableChordTypes.map(type => (
              <option key={type.id} value={type.symbol}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Duration Display */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400">Duration</label>
          <span className="text-white">{chord.duration} beats</span>
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="ml-auto text-red-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  )
} 