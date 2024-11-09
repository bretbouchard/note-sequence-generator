'use client'

import { useState, useEffect } from 'react'
import ChordProgressionTimelineContainer from './ChordProgressionTimelineContainer'
import type { ChordProgression, Chord, ChordType } from '@/types/progression'

interface Props {
  initialProgression?: ChordProgression
  onProgressionChange: (progression: ChordProgression) => void
}

export default function ChordProgressionManager({ initialProgression, onProgressionChange }: Props) {
  const [progression, setProgression] = useState<ChordProgression>(initialProgression || {
    id: '',
    name: 'New Progression',
    chords: [],
    totalDuration: 16,
    isPreset: false,
    category: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  const [savedProgressions, setSavedProgressions] = useState<ChordProgression[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch progressions on mount
  useEffect(() => {
    const fetchProgressions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/progressions')
        if (response.ok) {
          const data = await response.json()
          setSavedProgressions(data)
          
          // Select default progression if none selected
          if (!progression.id) {
            const defaultProg = data.find(p => p.id === 'c4f66532-4e06-4e13-896d-21644ae7e589')
            if (defaultProg) {
              handleProgressionSelect(defaultProg.id)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching progressions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgressions()
  }, [])

  const handleProgressionSelect = async (id: string) => {
    try {
      const response = await fetch(`/api/progressions/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProgression(data)
        onProgressionChange(data)
      }
    } catch (error) {
      console.error('Error selecting progression:', error)
    }
  }

  const handleProgressionUpdate = (updatedProgression: ChordProgression) => {
    setProgression(updatedProgression)
    onProgressionChange(updatedProgression)
  }

  return (
    <div className="space-y-6">
      {/* Progression Selection */}
      <div className="flex items-center gap-4">
        <select
          value={progression.id || ''}
          onChange={(e) => handleProgressionSelect(e.target.value)}
          className="bg-gray-700 rounded px-3 py-2 min-w-[200px]"
          disabled={isLoading}
        >
          <option value="">Select Progression</option>
          {savedProgressions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.chords.length} chords)
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <ChordProgressionTimelineContainer
          progression={progression}
          onChange={handleProgressionUpdate}
        />
      </div>

      {/* Add Chord Button */}
      <button
        onClick={() => {
          const lastChord = progression.chords[progression.chords.length - 1]
          const newPosition = lastChord ? lastChord.position + lastChord.duration : 0
          const newChord: Chord = {
            id: crypto.randomUUID(),
            degree: 'Imaj7',
            chordType: 'maj7',
            scaleDegree: 1,
            duration: 4.0,
            position: newPosition,
            chordNotesDegree: '1,3,5,7',
            order: progression.chords.length
          }
          handleProgressionUpdate({
            ...progression,
            chords: [...progression.chords, newChord]
          })
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Add Chord
      </button>
    </div>
  )
} 