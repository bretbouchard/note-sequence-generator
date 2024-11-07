'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ChordProgression } from '@/types/music'

interface Props {
  defaultProgression?: string
  onProgressionSelect: (progression: ChordProgression) => void
}

export default function ChordProgressionSelector({ defaultProgression = 'I-VI-II-V', onProgressionSelect }: Props) {
  const [progressions, setProgressions] = useState<ChordProgression[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch chord progressions and set default
  useEffect(() => {
    const fetchProgressions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/progressions')
        if (!response.ok) throw new Error('Failed to fetch progressions')
        const data = await response.json()
        setProgressions(data)
        
        // Set default progression only if no progression is selected
        if (!selectedId) {
          const defaultProg = data.find(p => p.name.includes(defaultProgression))
          if (defaultProg) {
            setSelectedId(defaultProg.id)
            onProgressionSelect(defaultProg)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load progressions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgressions()
  }, [defaultProgression, onProgressionSelect, selectedId])

  const handleSelect = useCallback((id: string) => {
    const selected = progressions.find(p => p.id === id)
    if (selected && id !== selectedId) {
      console.log('Selecting new progression:', selected.name)
      setSelectedId(id)
      onProgressionSelect(selected)
    }
  }, [progressions, selectedId, onProgressionSelect])

  return (
    <div className="flex gap-4 items-center">
      {isLoading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-400">{error}</div>
      ) : (
        <>
          <select
            value={selectedId}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-48 bg-gray-700 text-white rounded px-2 py-1"
          >
            <option value="">Select progression</option>
            {progressions.map((progression) => (
              <option key={progression.id} value={progression.id}>
                {progression.name}
              </option>
            ))}
          </select>

          {selectedId && (
            <div className="flex gap-1">
              {progressions
                .find(p => p.id === selectedId)
                ?.chords.map((chord, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-gray-700 rounded text-xs flex flex-col items-center min-w-[3rem]"
                  >
                    <span className="font-medium">{chord.degree}</span>
                    <span className="text-[0.65rem] text-gray-400">
                      {chord.chord_notes_degree.join(',')}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}