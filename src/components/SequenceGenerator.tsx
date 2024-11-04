'use client'

import { useState } from 'react'
import type { Scale, ChordProgression, NoteTemplate, NoteSequence } from '@/types/music'

interface SequenceGeneratorProps {
  onSequenceGenerated: (sequence: NoteSequence) => void
}

export const SequenceGenerator = ({ onSequenceGenerated }: SequenceGeneratorProps) => {
  const [key, setKey] = useState('C')
  const [loading, setLoading] = useState(false)

  const defaultScale: Scale = {
    degrees: [1, 2, 3, 4, 5, 6, 7],
    intervals: [0, 2, 4, 5, 7, 9, 11]
  }

  const defaultProgression: ChordProgression = {
    degrees: [1, 4, 5],
    durations: [4, 2, 2]
  }

  const defaultTemplate: NoteTemplate = {
    probabilities: [
      { scaleDegree: 1, weight: 0.4 },
      { scaleDegree: 3, weight: 0.3 },
      { scaleDegree: 5, weight: 0.3 }
    ]
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sequence/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          scale: defaultScale,
          chordProgression: defaultProgression,
          template: defaultTemplate
        })
      })

      const data = await response.json()
      if (data.sequence) {
        onSequenceGenerated(data.sequence)
      }
    } catch (error) {
      console.error('Failed to generate sequence:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
      <div className="space-y-2">
        <label 
          htmlFor="key-select" 
          className="block text-sm font-medium text-gray-700"
        >
          Key
        </label>
        <select
          id="key-select"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label="Select musical key"
        >
          {['C', 'G', 'D', 'A', 'E', 'B', 'F'].map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        aria-label="Generate sequence"
      >
        {loading ? 'Generating...' : 'Generate Sequence'}
      </button>
    </div>
  )
} 