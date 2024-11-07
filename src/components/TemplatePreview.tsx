'use client'

import { useEffect, useRef } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  noteTemplate?: NoteTemplate
  rhythmTemplate?: RhythmTemplate
  sequenceLength: number
}

export default function TemplatePreview({ noteTemplate, rhythmTemplate, sequenceLength }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Constants
    const barWidth = canvas.width / sequenceLength
    const gridHeight = canvas.height / 8 // 7 scale degrees + 1 for spacing

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1

    // Vertical lines (bars)
    for (let i = 0; i <= sequenceLength; i++) {
      const x = i * barWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Horizontal lines (scale degrees)
    for (let i = 0; i <= 7; i++) {
      const y = i * gridHeight
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw note template preview
    if (noteTemplate) {
      const startX = noteTemplate.repetition.startBar * barWidth
      const width = noteTemplate.repetition.duration * barWidth

      // Template region background
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)' // blue with low opacity
      ctx.fillRect(startX, 0, width, canvas.height)

      // Template pattern preview
      ctx.fillStyle = '#3B82F6' // blue
      noteTemplate.scaleDegrees.forEach((degree, index) => {
        const x = startX + (index * width / noteTemplate.scaleDegrees.length)
        const y = canvas.height - (degree * gridHeight)
        const noteWidth = 10
        const noteHeight = 10

        ctx.beginPath()
        ctx.arc(x + noteWidth/2, y, noteWidth/2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw rhythm template preview
    if (rhythmTemplate) {
      const startX = rhythmTemplate.repetition.startBar * barWidth
      const width = rhythmTemplate.repetition.duration * barWidth

      // Template region background
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)' // green with low opacity
      ctx.fillRect(startX, 0, width, canvas.height)

      // Template pattern preview
      ctx.strokeStyle = '#10B981' // green
      ctx.lineWidth = 2
      let currentX = startX

      rhythmTemplate.durations.forEach(duration => {
        const segmentWidth = (duration / rhythmTemplate.templateDuration) * width
        
        // Draw duration block
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'
        ctx.fillRect(currentX, canvas.height - gridHeight, segmentWidth, gridHeight)
        
        // Draw duration value
        ctx.fillStyle = '#10B981'
        ctx.font = '12px monospace'
        ctx.fillText(
          duration.toString(),
          currentX + 4,
          canvas.height - gridHeight/2
        )

        currentX += segmentWidth
      })
    }

  }, [noteTemplate, rhythmTemplate, sequenceLength])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white">Template Preview</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-32 rounded-md"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <div>Bar 1</div>
        <div>Bar {sequenceLength}</div>
      </div>
    </div>
  )
} 