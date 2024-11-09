'use client'

import { useState, useRef } from 'react'
import type { ChordProgression, Chord } from '@/types/progression'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CHORD_TYPES = [
  'maj7', 'm7', '7', 'ø7', '°7', 'sus4', '9',
  'maj9', 'm9', '13', 'maj13', 'm13', 'add9',
  '6', 'm6', 'aug', 'dim'
]

interface TimelineProps {
  progression: ChordProgression
  onChange: (progression: ChordProgression) => void
  zoom: number
}

export default function ChordProgressionTimeline({ 
  progression, 
  onChange,
  zoom = 1
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [editingChord, setEditingChord] = useState<string | null>(null)
  const [originalChord, setOriginalChord] = useState<Chord | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize' | null
    chordIndex: number | null
    startX: number
    startWidth?: number
    startPosition?: number
    edge?: 'left' | 'right'
  }>({ type: null, chordIndex: null, startX: 0 })

  // Calculate dimensions
  const basePixelsPerBeat = 60
  const pixelsPerBeat = basePixelsPerBeat * zoom
  const minBeats = 16
  const totalBeats = Math.max(minBeats, getLastChordEnd())
  const totalWidth = totalBeats * pixelsPerBeat
  const gridLines = Array.from({ length: totalBeats + 1 })

  function getLastChordEnd() {
    if (!progression.chords.length) return minBeats
    const lastChord = progression.chords[progression.chords.length - 1]
    return Math.max(minBeats, lastChord.position + lastChord.duration)
  }

  const handleChordClick = (chord: Chord, e: React.MouseEvent) => {
    e.stopPropagation()
    if (editingChord === chord.id) {
      setEditingChord(null)
      setOriginalChord(null)
    } else {
      setEditingChord(chord.id)
      setOriginalChord({ ...chord })
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (originalChord) {
      const updatedChords = progression.chords.map(c =>
        c.id === originalChord.id ? originalChord : c
      )
      onChange({ ...progression, chords: updatedChords })
    }
    setEditingChord(null)
    setOriginalChord(null)
  }

  const handleDeleteChord = (chordId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedChords = progression.chords.filter(c => c.id !== chordId)
    onChange({ ...progression, chords: updatedChords })
    setEditingChord(null)
    setOriginalChord(null)
  }

  const handleMouseDown = (e: React.MouseEvent, index: number, type: 'move' | 'resize', edge?: 'left' | 'right') => {
    e.stopPropagation()
    const chord = progression.chords[index]
    
    setDragState({
      type,
      chordIndex: index,
      startX: e.clientX,
      startWidth: chord.duration * pixelsPerBeat,
      startPosition: chord.position * pixelsPerBeat,
      edge
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragState.type === null || dragState.chordIndex === null) return

    const deltaX = e.clientX - dragState.startX
    const chord = progression.chords[dragState.chordIndex]

    if (dragState.type === 'move' && dragState.startPosition !== undefined) {
      const newPosition = Math.max(0, dragState.startPosition + deltaX)
      const snappedPosition = Math.round(newPosition / pixelsPerBeat) * pixelsPerBeat
      const newBeatPosition = snappedPosition / pixelsPerBeat

      // Check for collisions
      const wouldCollide = progression.chords.some((otherChord, i) => {
        if (i === dragState.chordIndex) return false
        const otherStart = otherChord.position
        const otherEnd = otherChord.position + otherChord.duration
        const newStart = newBeatPosition
        const newEnd = newBeatPosition + chord.duration
        return (newStart < otherEnd && newEnd > otherStart)
      })

      if (!wouldCollide) {
        const updatedChords = progression.chords.map((c, i) => {
          if (i === dragState.chordIndex) {
            return { ...c, position: newBeatPosition }
          }
          return c
        })
        onChange({ ...progression, chords: updatedChords.sort((a, b) => a.position - b.position) })
      }
    }

    if (dragState.type === 'resize' && dragState.startPosition !== undefined && dragState.startWidth !== undefined) {
      let newDuration = chord.duration
      let newPosition = chord.position

      if (dragState.edge === 'left') {
        // Calculate new position and duration when dragging left edge
        const proposedPosition = Math.max(0, dragState.startPosition + deltaX)
        const snappedPosition = Math.round(proposedPosition / pixelsPerBeat) * pixelsPerBeat
        const positionInBeats = snappedPosition / pixelsPerBeat
        
        // Ensure minimum duration of 1 beat
        if (chord.position + chord.duration - positionInBeats >= 1) {
          newPosition = positionInBeats
          newDuration = chord.position + chord.duration - positionInBeats
        }
      } else {
        // Right edge resize
        const proposedWidth = Math.max(pixelsPerBeat, dragState.startWidth + deltaX)
        const snappedWidth = Math.round(proposedWidth / pixelsPerBeat) * pixelsPerBeat
        newDuration = Math.max(1, snappedWidth / pixelsPerBeat)
      }

      // Check for collisions
      const wouldCollide = progression.chords.some((otherChord, i) => {
        if (i === dragState.chordIndex) return false
        const otherStart = otherChord.position
        const otherEnd = otherChord.position + otherChord.duration
        const newStart = newPosition
        const newEnd = newPosition + newDuration
        return (newStart < otherEnd && newEnd > otherStart)
      })

      if (!wouldCollide) {
        const updatedChords = progression.chords.map((c, i) => {
          if (i === dragState.chordIndex) {
            return { ...c, position: newPosition, duration: newDuration }
          }
          return c
        })
        onChange({ ...progression, chords: updatedChords.sort((a, b) => a.position - b.position) })
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragState({ type: null, chordIndex: null, startX: 0 })
  }

  return (
    <div className="space-y-2">
      <div 
        ref={containerRef}
        className="relative h-32 bg-gray-800 rounded-lg overflow-x-auto"
      >
        <div
          ref={timelineRef}
          className="relative h-full"
          style={{ width: `${totalWidth}px` }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid */}
          <div className="absolute inset-0">
            {gridLines.map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-gray-700"
                style={{ 
                  left: `${i * pixelsPerBeat}px`,
                  opacity: i % 4 === 0 ? 0.5 : 0.2
                }}
              />
            ))}
          </div>

          {/* Beat numbers */}
          <div className="absolute top-0 left-0 right-0 h-6 flex select-none">
            {gridLines.map((_, i) => (
              <div
                key={i}
                className="absolute text-xs text-gray-400"
                style={{ 
                  left: `${i * pixelsPerBeat}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                {i}
              </div>
            ))}
          </div>

          {/* Chord blocks */}
          {progression.chords.map((chord, index) => (
            <motion.div
              key={chord.id}
              className={`absolute top-8 h-16 bg-blue-500 rounded-lg ${
                dragState.chordIndex === index ? 'ring-2 ring-white' : ''
              }`}
              style={{
                left: `${chord.position * pixelsPerBeat}px`,
                width: `${chord.duration * pixelsPerBeat - 2}px`,
              }}
            >
              {/* Move handle */}
              <div
                className="absolute inset-x-4 inset-y-0 cursor-move"
                onMouseDown={(e) => handleMouseDown(e, index, 'move')}
              />

              {/* Resize handles */}
              <div
                className="absolute left-0 top-0 bottom-0 w-4 cursor-ew-resize z-10"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleMouseDown(e, index, 'resize', 'left')
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize z-10"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleMouseDown(e, index, 'resize', 'right')
                }}
              />

              {/* Chord info and edit controls */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white"
              >
                <div 
                  className="text-base font-bold hover:text-blue-200 cursor-pointer"
                  onClick={(e) => handleChordClick(chord, e)}
                >
                  {chord.degree}
                </div>

                <AnimatePresence>
                  {editingChord === chord.id && (
                    <motion.div 
                      className="flex flex-col items-center gap-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1">
                        <select
                          value={chord.scaleDegree.toString()}
                          onChange={(e) => {
                            const updatedChords = progression.chords.map(c =>
                              c.id === chord.id ? { ...c, scaleDegree: Number(e.target.value) } : c
                            )
                            onChange({ ...progression, chords: updatedChords })
                          }}
                          className="bg-gray-700 rounded px-1 py-0.5 text-xs text-white"
                        >
                          {['1', '2', '3', '4', '5', '6', '7'].map(degree => (
                            <option key={degree} value={degree}>{degree}</option>
                          ))}
                        </select>
                        <select
                          value={chord.chordType}
                          onChange={(e) => {
                            const updatedChords = progression.chords.map(c =>
                              c.id === chord.id ? { ...c, chordType: e.target.value } : c
                            )
                            onChange({ ...progression, chords: updatedChords })
                          }}
                          className="bg-gray-700 rounded px-1 py-0.5 text-xs text-white"
                        >
                          {CHORD_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleCancel}
                          className="text-xs text-gray-300 hover:text-white px-2 py-0.5 bg-gray-700 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleDeleteChord(chord.id, e)}
                          className="text-gray-300 hover:text-white p-0.5 bg-gray-700 rounded"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-sm opacity-75">
                  {chord.duration} beats
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}