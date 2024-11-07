'use client'

import { useState, useEffect, useRef } from 'react'
import type { NoteTemplate, RhythmTemplate, NoteSequence } from '@/types/music'
import { useTemplateTransitions } from '@/hooks/useTemplateTransitions'

interface Props {
  sequence: NoteSequence | null
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  totalBars: number
  onPlaybackPositionChange?: (bar: number) => void
}

export default function TemplatePlayback({
  sequence,
  noteTemplates,
  rhythmTemplates,
  totalBars,
  onPlaybackPositionChange
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBar, setCurrentBar] = useState(0)
  const [tempo, setTempo] = useState(120)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const { getActiveTemplate } = useTemplateTransitions()

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new AudioContext()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)
    gainNodeRef.current.gain.value = 0

    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  // Handle playback
  useEffect(() => {
    if (!isPlaying || !sequence) return

    const beatsPerBar = 4
    const beatDuration = 60 / tempo
    const barDuration = beatDuration * beatsPerBar

    let lastNoteTime = audioContextRef.current?.currentTime || 0
    const scheduleAhead = 0.1 // Schedule notes 100ms ahead

    const playbackInterval = setInterval(() => {
      const currentTime = audioContextRef.current?.currentTime || 0
      
      while (lastNoteTime < currentTime + scheduleAhead) {
        const bar = Math.floor(lastNoteTime / barDuration) % totalBars
        const activeNoteTemplate = getActiveTemplate(noteTemplates, bar)
        const activeRhythmTemplate = getActiveTemplate(rhythmTemplates, bar)

        if (activeNoteTemplate && 'scaleDegrees' in activeNoteTemplate) {
          // Play note from template
          const noteIndex = Math.floor((lastNoteTime % barDuration) / beatDuration)
          const scaleDegree = activeNoteTemplate.scaleDegrees[noteIndex % activeNoteTemplate.scaleDegrees.length]
          
          // Convert scale degree to frequency
          const baseFrequency = 440 // A4
          const frequency = baseFrequency * Math.pow(2, (scaleDegree - 1) / 12)
          
          // Create and schedule oscillator
          const oscillator = audioContextRef.current!.createOscillator()
          oscillator.connect(gainNodeRef.current!)
          oscillator.frequency.value = frequency
          
          // Get duration from rhythm template
          const duration = activeRhythmTemplate && 'durations' in activeRhythmTemplate
            ? activeRhythmTemplate.durations[noteIndex % activeRhythmTemplate.durations.length]
            : 1

          // Schedule note
          oscillator.start(lastNoteTime)
          oscillator.stop(lastNoteTime + duration * beatDuration)
          
          // Update timing
          lastNoteTime += duration * beatDuration
        }
      }

      // Update current bar display
      const newBar = Math.floor((audioContextRef.current?.currentTime || 0) / barDuration) % totalBars
      if (newBar !== currentBar) {
        setCurrentBar(newBar)
        onPlaybackPositionChange?.(newBar)
      }
    }, 25) // Update every 25ms

    return () => {
      clearInterval(playbackInterval)
      oscillatorRef.current?.stop()
      oscillatorRef.current?.disconnect()
    }
  }, [isPlaying, sequence, tempo, totalBars, noteTemplates, rhythmTemplates, getActiveTemplate, currentBar, onPlaybackPositionChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isPlaying 
              ? 'bg-red-600 hover:bg-red-500' 
              : 'bg-blue-600 hover:bg-blue-500'
          } text-white`}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Tempo:</label>
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            className="w-20 bg-gray-700 text-white rounded px-2 py-1 text-sm"
            min="40"
            max="240"
            step="1"
          />
          <span className="text-sm text-gray-400">BPM</span>
        </div>
      </div>

      {/* Playback position indicator */}
      <div className="relative h-2 bg-gray-700 rounded overflow-hidden">
        <div 
          className="absolute h-full bg-blue-600 transition-all duration-100"
          style={{ width: `${(currentBar / totalBars) * 100}%` }}
        />
      </div>

      <div className="text-sm text-gray-400">
        Bar {currentBar + 1} of {totalBars}
      </div>
    </div>
  )
} 