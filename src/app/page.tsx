'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import { ChordProgressionSelector } from '@/components/ChordProgressionSelector'
import { SequenceDisplay } from '@/components/SequenceDisplay'
import ChordTemplateSelector from '@/components/ChordTemplateSelector'
import type { ChordProgressionData } from '@/types/music'
import chordProgressionsData from '@/data/ChordProgressions.json'
import ChordTemplates from '@/data/ChordTemplates'
import { ProgressionTemplateSelector } from '@/components/ProgressionTemplateSelector'
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
    <div className="min-h-screen bg-[#111827]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          NoteSequence Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-8">
          <div className="space-y-6">
            <ChordProgressionSelector
              progressions={progressions}
              onProgressionSelect={handleProgressionSelect}
            />
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChords(!showChords)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  showChords 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Chords
              </button>

              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  showNotes 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Notes
              </button>

              <button
                onClick={handleRegenerate}
                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm font-medium"
              >
                Regenerate
              </button>
            </div>

            <div className="h-[600px] bg-[#111827] rounded-lg overflow-hidden">
              {sequence ? (
                <SequenceDisplay 
                  sequence={sequence}
                  showChords={showChords}
                  showNotes={showNotes}
                  chordProgression={selectedProgression?.chords}
                  onDurationsChange={handleDurationsChange}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300 text-lg font-medium">
                  Generate a sequence to view visualization
                </div>
              )}
            </div>

            {selectedProgression && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-white mb-4">
                  Progression Template
                </h3>
                <ProgressionTemplateSelector
                  onTemplateSelect={handleProgressionTemplateSelect}
                  currentTemplate={progressionTemplate?.id}
                />
              </div>
            )}

            {selectedProgression && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">
                  Chord Templates
                </h3>
                <div className="space-y-6">
                  {selectedProgression.chords.map((chord) => (
                    <div key={chord.id} className="border-b border-gray-700 pb-4">
                      <div className="text-gray-300 mb-2">
                        {chord.degree} ({chord.scale_degree})
                      </div>
                      <ChordTemplateSelector
                        chordId={chord.id}
                        currentTemplate={chordTemplates[chord.id]}
                        onTemplateSelect={handleTemplateSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 