'use client'

import { useState, useEffect, useCallback } from 'react'
import ChordProgressionManager from './ChordProgressionManager'
import TemplateEditor from './TemplateEditor'
import type { ChordProgression } from '@/types/progression'
import type { NoteTemplate, RhythmTemplate } from '@/types/templates'
import { generateSequence } from '@/lib/sequenceTransforms'

const DEFAULT_PROGRESSION_ID = 'c4f66532-4e06-4e13-896d-21644ae7e589'

// Add type checking
interface Chord {
  id: string;
  root: string;
  quality: string;
  duration: number;
  // Add other chord properties as needed
}

interface Progression {
  id: string;
  name: string;
  chords: Chord[];
}

export default function SequenceGenerator() {
  console.log('=== SequenceGenerator Render ===')
  
  const [progression, setProgression] = useState<ChordProgression | null>(null)
  const [noteTemplates, setNoteTemplates] = useState<NoteTemplate[]>([])
  const [rhythmTemplates, setRhythmTemplates] = useState<RhythmTemplate[]>([])
  const [sequence, setSequence] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Add type validation for progression
  const validateProgression = (prog: ChordProgression) => {
    console.log('Validating progression:', prog)
    return prog.chords && 
           Array.isArray(prog.chords) && 
           prog.chords.every(chord => 
             chord.root && 
             chord.quality && 
             typeof chord.duration === 'number'
           )
  }

  // Modify the progression setter to include validation
  const handleProgressionChange = (newProgression: ChordProgression) => {
    console.log('=== Progression Changed ===', newProgression)
    if (!validateProgression(newProgression)) {
      console.error('Invalid progression structure:', newProgression)
      return
    }
    setProgression(newProgression)
  }

  const fetchProgression = async (id: string) => {
    try {
      console.log('Fetching progression:', id)
      const response = await fetch(`/api/progressions/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received progression data:', data)
      return data
    } catch (error) {
      console.error('Failed to fetch progression:', error)
      return null
    }
  }

  // Update the initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('=== Loading Initial Data ===')
      try {
        setIsLoading(true)
        
        // Load default progression with type checking
        console.log('Fetching progression:', DEFAULT_PROGRESSION_ID)
        const prog = await fetchProgression(DEFAULT_PROGRESSION_ID)
        if (prog) {
          setProgression(prog)
        }

        // Load templates
        console.log('Fetching templates...')
        const templatesResponse = await fetch('/api/templates')
        const templatesData = await templatesResponse.json()
        console.log('Loaded templates:', templatesData)

        setNoteTemplates(templatesData.noteTemplates)
        setRhythmTemplates(templatesData.rhythmTemplates)

      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setIsLoading(false)
        console.log('=== Initial Data Load Complete ===')
      }
    }

    loadInitialData()
  }, [])

  // Add detailed logging for progression data
  useEffect(() => {
    if (progression) {
      console.log('=== Progression Data Detail ===')
      console.log('Full progression:', JSON.stringify(progression, null, 2))
      console.log('Chord count:', progression.chords?.length)
      console.log('First chord:', progression.chords?.[0])
    }
  }, [progression])

  // Update generate sequence to include more detailed logging
  const generateNewSequence = useCallback(() => {
    console.log('=== Sequence Generation Attempt ===')
    console.log('Loading state:', isLoading)
    console.log('Has progression:', !!progression)
    console.log('Note templates count:', noteTemplates.length)
    console.log('Rhythm templates count:', rhythmTemplates.length)
    
    if (!progression?.chords) {
      console.error('Missing chord data in progression:', progression)
      return
    }

    // Log the actual data being used
    console.log('Generation inputs:', {
      progressionChords: progression.chords,
      noteTemplateCount: noteTemplates.length,
      rhythmTemplateCount: rhythmTemplates.length
    })

    console.log('=== Attempting to Generate New Sequence ===')
    
    if (!progression) {
      console.error('No progression available')
      return
    }

    console.log('Using progression:', {
      id: progression.id,
      chordCount: progression.chords.length,
      chords: progression.chords.map(c => `${c.root}${c.quality}`)
    })

    // Early return if still loading or missing data
    if (isLoading) {
      console.log('Still loading, skipping generation')
      return
    }

    if (noteTemplates.length === 0 || rhythmTemplates.length === 0) {
      console.log('Missing templates, skipping generation')
      return
    }

    console.log('All data available, generating sequence')
    const newSequence = generateSequence({
      progression,
      noteTemplates,
      rhythmTemplates
    })

    console.log('New sequence generated:', newSequence)
    setSequence(newSequence)
  }, [progression, noteTemplates, rhythmTemplates, isLoading])

  // Generate sequence when data changes
  useEffect(() => {
    if (!isLoading && progression && noteTemplates.length > 0 && rhythmTemplates.length > 0) {
      console.log('=== All Data Loaded, Triggering Generation ===')
      generateNewSequence()
    }
  }, [isLoading, progression, noteTemplates, rhythmTemplates, generateNewSequence])

  const handleGenerateClick = () => {
    console.log('=== Manual Generation Triggered ===')
    generateNewSequence()
  }

  // Add visual confirmation of sequence updates
  useEffect(() => {
    if (sequence) {
      console.log('Sequence updated in generator:', sequence)
    }
  }, [sequence])

  return (
    <div className="relative w-full h-full border border-gray-300 rounded-lg" 
         style={{ minHeight: '200px' }}> {/* Add explicit height */}
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {sequence ? (
            <NoteSequenceCanvas 
              sequence={sequence}
              className="w-full h-full"
              onRender={() => console.log('Canvas rendered')} // Add render callback
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span>No sequence generated</span>
            </div>
          )}
        </>
      )}
    </div>
  )
} 