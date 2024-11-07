'use client'

import { useState, useCallback } from 'react'
import PianoRollView from '@/components/PianoRollView'
import TemplateManager from '@/components/TemplateManager'
import ChordProgressionSelector from '@/components/ChordProgressionSelector'
import type { NoteTemplate, RhythmTemplate, NoteSequence, ChordProgression } from '@/types/music'

export default function Home() {
  const [sequence, setSequence] = useState<NoteSequence | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedProgression, setSelectedProgression] = useState<ChordProgression | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerationTime, setLastGenerationTime] = useState(0)
  const [currentTemplates, setCurrentTemplates] = useState<{
    note: NoteTemplate[],
    rhythm: RhythmTemplate[]
  }>({
    note: [{
      id: 'default-note',
      scaleDegrees: [1, 2, 3, 4, 5],
      weights: [1, 1, 1, 1, 1],
      repetition: { startBar: 0, duration: 4 },
      direction: 'forward',
      behavior: 'continuous',
      useChordTones: false
    }],
    rhythm: [{
      id: 'default-rhythm',
      durations: [1, 1, 1, 1],
      templateDuration: 4,
      repetition: { startBar: 0, duration: 4 },
      behavior: 'continuous'
    }]
  })
  const [showChords, setShowChords] = useState(true)
  const [showNotes, setShowNotes] = useState(true)

  const generateSequence = useCallback(async (
    progression: ChordProgression,
    noteTemplates: NoteTemplate[] = currentTemplates.note,
    rhythmTemplates: RhythmTemplate[] = currentTemplates.rhythm
  ) => {
    const now = Date.now()
    if (now - lastGenerationTime < 1000 || isGenerating) return
    
    try {
      setIsGenerating(true)
      setError(null)
      setLastGenerationTime(now)
      
      console.log('Generating sequence:', {
        progression,
        noteTemplates,
        rhythmTemplates
      })
      
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
          chordProgression: progression,
          template: {
            sequenceLength: progression.chords.length * 4,
            noteTemplates,
            rhythmTemplates,
            seeds: {
              noteSeed: Math.floor(Math.random() * 1000000),
              rhythmSeed: Math.floor(Math.random() * 1000000)
            }
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate sequence')
      }

      const data = await response.json()
      console.log('Generated sequence:', data)
      
      if (!data.scaleDegrees || !data.durations) {
        throw new Error('Invalid sequence data received')
      }
      
      setSequence(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate sequence')
      console.error('Sequence generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, lastGenerationTime])

  // Handle progression selection
  const handleProgressionSelect = useCallback((progression: ChordProgression) => {
    console.log('Progression selected:', progression)
    setSelectedProgression(progression)
    generateSequence(progression, currentTemplates.note, currentTemplates.rhythm)
  }, [generateSequence, currentTemplates])

  // Handle template changes
  const handleTemplateChange = useCallback((noteTemplates: NoteTemplate[], rhythmTemplates: RhythmTemplate[]) => {
    console.log('Template change:', { noteTemplates, rhythmTemplates, currentProgression: selectedProgression })
    
    setCurrentTemplates({
      note: noteTemplates,
      rhythm: rhythmTemplates
    })
    
    // Only generate new sequence if we have a progression
    if (selectedProgression) {
      // Use the stored progression, not a new one
      generateSequence(selectedProgression, noteTemplates, rhythmTemplates)
    }
  }, [selectedProgression, generateSequence])

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="space-y-6">
        {/* Header Controls - All Inline */}
        <div className="flex items-center gap-4">
          {/* Display Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowChords(!showChords)}
              className={`px-2 py-1 rounded text-sm ${
                showChords 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {showChords ? 'Hide Chords' : 'Show Chords'}
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-2 py-1 rounded text-sm ${
                showNotes 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {showNotes ? 'Hide Notes' : 'Show Notes'}
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-700"></div>

          {/* Chord Progression Selector */}
          <ChordProgressionSelector
            defaultProgression="I-VI-II-V"
            onProgressionSelect={handleProgressionSelect}
          />
        </div>

        {/* Piano Roll View */}
        <div className="h-[60vh] bg-gray-800 rounded-lg overflow-hidden">
          <PianoRollView
            sequence={sequence}
            showChords={showChords}
            showNotes={showNotes}
            onSequenceUpdate={setSequence}
          />
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="p-4 bg-red-900/50 rounded-md">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        {isGenerating && (
          <div className="p-4 bg-blue-900/50 rounded-md">
            <p className="text-blue-200">Generating sequence...</p>
          </div>
        )}

        {/* Templates in Two Columns */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <TemplateManager 
              type="note"
              onTemplateChange={handleTemplateChange}
              currentTemplates={currentTemplates}
            />
          </div>
          <div className="space-y-4">
            <TemplateManager 
              type="rhythm"
              onTemplateChange={handleTemplateChange}
              currentTemplates={currentTemplates}
            />
          </div>
        </div>
      </div>
    </main>
  )
} 