'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { NoteSequence } from '@/types/music'

interface Props {
  sequence: NoteSequence | null
  showChords: boolean
  showNotes: boolean
  onSequenceUpdate: (sequence: NoteSequence) => void
}

export default function PianoRollView({ sequence, showChords, showNotes, onSequenceUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Handle resize
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Draw function
  const drawPianoRoll = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !sequence) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = dimensions.width * window.devicePixelRatio
    canvas.height = dimensions.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas with darker background
    ctx.fillStyle = '#0F172A'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    const gridSize = 40
    const totalBeats = sequence.durations.reduce((sum, dur) => sum + dur, 0)
    const maxDegree = 28 // Increased range for 4 octaves

    // Draw grid lines with slightly lighter color
    ctx.strokeStyle = '#1E293B' // Slightly lighter than background for grid lines
    ctx.lineWidth = 1

    // Vertical grid lines (beats)
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = beat * gridSize - scrollPosition.x
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Horizontal grid lines (scale degrees)
    for (let degree = 0; degree <= maxDegree; degree++) {
      const y = canvas.height - (degree * gridSize) + scrollPosition.y
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw chord progression
    if (showChords && sequence.chordProgression && sequence.chordProgression.degrees) {
      let currentBeat = 0
      sequence.chordProgression.degrees.forEach((chordDegree, index) => {
        if (!chordDegree) return
        
        const duration = sequence.chordProgression.durations[index]
        const x = currentBeat * gridSize - scrollPosition.x
        const width = duration * gridSize

        // Draw chord label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '14px monospace'
        const chordLabel = typeof chordDegree === 'string' ? chordDegree : chordDegree.toString()
        ctx.fillText(chordLabel, x + 5, 20)

        // Get chord root and tones
        const numericDegree = typeof chordDegree === 'string' 
          ? convertChordToNumber(chordDegree)
          : chordDegree

        if (typeof numericDegree === 'number') {
          // Get actual chord tones for this chord
          const chordTones = getChordTones(chordDegree)
          
          // Draw chord tones
          chordTones.forEach(tone => {
            const y = canvas.height - (tone * gridSize) + scrollPosition.y
            ctx.fillStyle = tone === numericDegree 
              ? 'rgba(59, 130, 246, 0.3)' // Root note
              : 'rgba(59, 130, 246, 0.15)' // Other chord tones
            ctx.fillRect(x, y, width, gridSize - 2)
          })
        }

        currentBeat += duration
      })
    }

    // Draw notes and rests
    if (showNotes && sequence.scaleDegrees) {
      let currentBeat = 0
      sequence.scaleDegrees.forEach((degree, index) => {
        const duration = sequence.durations[index]
        const x = currentBeat * gridSize - scrollPosition.x
        const width = duration * gridSize - 2
        const height = gridSize - 2

        if (degree === null) {
          // Draw rest
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
          ctx.fillRect(x, canvas.height - gridSize * 2, width, height)
        } else {
          // Draw note
          const y = canvas.height - (degree * gridSize) + scrollPosition.y
          ctx.fillStyle = '#3B82F6'
          ctx.fillRect(x, y, width, height)
        }

        currentBeat += duration
      })
    }

  }, [sequence, showChords, showNotes, scrollPosition, dimensions])

  // Trigger redraw on changes
  useEffect(() => {
    drawPianoRoll()
  }, [drawPianoRoll])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    setScrollPosition({
      x: containerRef.current.scrollLeft,
      y: containerRef.current.scrollTop
    })
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-auto"
      onScroll={handleScroll}
    >
      <canvas
        ref={canvasRef}
        className="min-w-full min-h-full"
        style={{ 
          width: dimensions.width,
          height: dimensions.height,
          cursor: 'pointer',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  )
}

function getChordTones(chord: string | number): number[] {
  if (typeof chord === 'string') {
    // Define chord tones based on chord type
    switch(chord) {
      case 'ii7':
        return [2, 4, 6, 1] // 2nd, 4th, 6th, root
      case 'V7':
        return [5, 7, 2, 4] // 5th, 7th, 2nd, 4th
      case 'Imaj7':
        return [1, 3, 5, 7] // root, 3rd, 5th, 7th
      case 'i':
      case 'I':
        return [1, 3, 5]
      case 'ii':
      case 'II':
        return [2, 4, 6]
      case 'iii':
      case 'III':
        return [3, 5, 7]
      case 'IV':
        return [4, 6, 1]
      case 'V':
        return [5, 7, 2]
      case 'vi':
      case 'VI':
        return [6, 1, 3]
      case 'vii':
      case 'VII':
        return [7, 2, 4]
      default:
        return [1, 3, 5] // Default to major triad
    }
  } else {
    // Numeric degree - return triad
    return [chord, ((chord + 2) % 7) || 7, ((chord + 4) % 7) || 7]
  }
}

function convertChordToNumber(chord: string): number {
  const chordMap: Record<string, number> = {
    'I': 1, 'i': 1,
    'II': 2, 'ii': 2, 'ii7': 2,
    'III': 3, 'iii': 3,
    'IV': 4, 'iv': 4,
    'V': 5, 'v': 5, 'V7': 5,
    'VI': 6, 'vi': 6,
    'VII': 7, 'vii': 7
  }
  return chordMap[chord] || 1
} 