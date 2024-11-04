'use client'

import { useState } from 'react'
import type { ChordProgressionData } from '@/types/music'

type Props = {
  progressions: ChordProgressionData[]
  onProgressionSelect: (progression: ChordProgressionData) => void
}

const KEYS = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F',
  'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'
]

const SCALES = [
  'Major',
  'Natural Minor',
  'Harmonic Minor', 
  'Melodic Minor',
  'Dorian',
  'Phrygian',
  'Lydian',
  'Mixolydian',
  'Locrian'
]

const ChordProgressionSelector = ({ progressions, onProgressionSelect }: Props) => {
  const [selectedKey, setSelectedKey] = useState<string>(KEYS[0])
  const [selectedScale, setSelectedScale] = useState<string>(SCALES[0])
  const [selectedProgression, setSelectedProgression] = useState<ChordProgressionData | null>(null)

  const handleProgressionChange = (progressionId: string) => {
    const progression = progressions.find(p => p.id === progressionId)
    if (progression) {
      setSelectedProgression(progression)
      onProgressionSelect(progression)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <div className="grid grid-cols-3 gap-4">
        {/* Key Selection */}
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="key-select" 
            className="text-sm font-medium text-gray-700"
          >
            Key
          </label>
          <select
            id="key-select"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          >
            {KEYS.map((key) => (
              <option key={key} value={key} className="text-gray-900">
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Scale Selection */}
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="scale-select" 
            className="text-sm font-medium text-gray-700"
          >
            Scale
          </label>
          <select
            id="scale-select"
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          >
            {SCALES.map((scale) => (
              <option key={scale} value={scale} className="text-gray-900">
                {scale}
              </option>
            ))}
          </select>
        </div>

        {/* Progression Selection */}
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="progression-select" 
            className="text-sm font-medium text-gray-700"
          >
            Progression
          </label>
          <select
            id="progression-select"
            value={selectedProgression?.id || ''}
            onChange={(e) => handleProgressionChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          >
            <option value="" className="text-gray-900">Select a progression</option>
            {progressions.map((progression) => (
              <option key={progression.id} value={progression.id} className="text-gray-900">
                {progression.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display selected progression details */}
      {selectedProgression && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Selected Progression: {selectedProgression.name}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {selectedProgression.chords.map((chord) => (
              <div 
                key={chord.id}
                className="px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 text-gray-900"
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

export default ChordProgressionSelector 