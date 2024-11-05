'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import ChordProgressionSelector from '@/components/ChordProgressionSelector'
import SequenceDisplay from '@/components/SequenceDisplay'
import ChordTemplateSelector from '@/components/ChordTemplateSelector'
import ProgressionTemplateSelector from '@/components/ProgressionTemplateSelector'
import type { ChordProgressionData } from '@/types/music'
import chordProgressionsData from '@/data/ChordProgressions.json'
import ChordTemplates from '@/data/ChordTemplates'
import type { ProgressionTemplateRule } from '@/types/templates'

export default function Home() {
  const [selectedProgression, setSelectedProgression] = useState<ChordProgressionData | null>(null)
  const [sequence, setSequence] = useState<any>(null)
  const [showChords, setShowChords] = useState(true)
  const [showNotes, setShowNotes] = useState(true)
  const [chordTemplates, setChordTemplates] = useState<Record<string, string>>({})
  const [progressions, setProgressions] = useState<ChordProgressionData[]>([])
  const [progressionTemplate, setProgressionTemplate] = useState<ProgressionTemplateRule | null>(null)

  // Immediate sequence generation without debounce
  const generateSequence = async (progression: ChordProgressionData) => {
    try {
      const response = await fetch('/api/sequence/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'C',
          scale: {
            degrees: [1, 2, 3, 4, 5, 6, 7],
            intervals: [0, 2, 4, 5, 7, 9, 11]
          },
          chordProgression: {
            degrees: progression.chords.map(c => {
              const degree = c.scale_degree.replace(/[^\d]/g, '');
              return parseInt(degree) || 1;
            }),
            durations: progression.chords.map(chord => {
              const template = chordTemplates[chord.id]
              if (template) {
                const templatePattern = Object.values(ChordTemplates)
                  .flat()
                  .find(t => t.id === template)
                return templatePattern?.pattern.duration || 4
              }
              return 4
            })
          },
          template: {
            probabilities: progression.chords.map((chord) => ({
              scaleDegree: parseInt(chord.scale_degree.replace(/[^\d]/g, '')) || 1,
              weight: 1 / progression.chords.length
            }))
          }
        })
      })

      const data = await response.json()
      if (data.sequence) {
        setSequence(data.sequence)
      }
    } catch (error) {
      console.error('Failed to generate sequence:', error)
    }
  }

  // Debounced version only for duration changes
  const debouncedGenerateSequence = useCallback(
    debounce((progression: ChordProgressionData) => {
      generateSequence(progression)
    }, 500),
    [chordTemplates]
  )

  // Handle progression selection - immediate update
  const handleProgressionSelect = async (progression: ChordProgressionData) => {
    setSelectedProgression(progression)
    await generateSequence(progression)
  }

  // Handle regenerate - immediate update
  const handleRegenerate = async () => {
    if (!selectedProgression) return
    await generateSequence(selectedProgression)
  }

  // Handle template selection - immediate update
  const handleTemplateSelect = async (chordId: string, templateId: string) => {
    const newTemplates = {
      ...chordTemplates,
      [chordId]: templateId
    }
    setChordTemplates(newTemplates)
    
    if (selectedProgression) {
      await generateSequence(selectedProgression)
    }
  }

  // Handle duration changes - debounced
  const handleDurationsChange = (newDurations: number[]) => {
    if (!selectedProgression) return
    debouncedGenerateSequence(selectedProgression)
  }

  // Handle progression template selection
  const handleProgressionTemplateSelect = (template: ProgressionTemplateRule) => {
    setProgressionTemplate(template)
    if (selectedProgression) {
      // Apply the template pattern to all chords
      const newTemplates = { ...chordTemplates }
      const { templateIds, applyRule, repeatCount = 1 } = template.pattern
      
      selectedProgression.chords.forEach((chord, index) => {
        let templateIndex: number
        
        switch (applyRule) {
          case 'sequential':
            templateIndex = index % templateIds.length
            break
          case 'alternate':
            templateIndex = index % 2
            break
          case 'random':
            templateIndex = Math.floor(Math.random() * templateIds.length)
            break
          case 'repeat':
            templateIndex = Math.floor(index / repeatCount) % templateIds.length
            break
          default:
            templateIndex = 0
        }
        
        newTemplates[chord.id] = templateIds[templateIndex]
      })
      
      setChordTemplates(newTemplates)
      generateSequence(selectedProgression)
    }
  }

  // Fetch progressions on mount
  useEffect(() => {
    const fetchProgressions = async () => {
      try {
        const response = await fetch('/api/progressions')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProgressions(data)
      } catch (error) {
        console.error('Failed to fetch progressions:', error)
      }
    }

    fetchProgressions()
  }, [])

  return (
    <main className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="w-80 min-h-screen bg-gray-900 p-4 flex flex-col gap-6 overflow-y-auto">
        {/* Chord Progression Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Chord Progression</h2>
          <ChordProgressionSelector
            progressions={progressions}
            onProgressionSelect={handleProgressionSelect}
          />
        </section>

        {/* Template Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Templates</h2>
          <ChordTemplateSelector
            templates={ChordTemplates}
            onTemplateSelect={handleTemplateSelect}
          />
          <ProgressionTemplateSelector
            onTemplateSelect={handleProgressionTemplateSelect}
          />
        </section>

        {/* Controls Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Controls</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showChords}
                onChange={(e) => setShowChords(e.target.checked)}
                className="mr-2"
              />
              Show Chords
            </label>
            <label className="text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={(e) => setShowNotes(e.target.checked)}
                className="mr-2"
              />
              Show Notes
            </label>
          </div>
        </section>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        <SequenceDisplay
          sequence={sequence}
          showChords={showChords}
          showNotes={showNotes}
          chordProgression={selectedProgression?.chords}
          onDurationsChange={handleDurationsChange}
        />
      </div>
    </main>
  )
} 