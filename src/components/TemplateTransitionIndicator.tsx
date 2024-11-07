'use client'

import { useEffect, useRef } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  fromTemplate: NoteTemplate | RhythmTemplate
  toTemplate: NoteTemplate | RhythmTemplate
  type: 'note' | 'rhythm'
  transitionBar: number
}

export default function TemplateTransitionIndicator({
  fromTemplate,
  toTemplate,
  type,
  transitionBar
}: Props) {
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

    // Draw transition indicator
    const barWidth = 40 // Assuming 40px per bar
    const x = transitionBar * barWidth

    // Draw vertical transition line
    ctx.strokeStyle = '#4B5563'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()

    // Draw transition arrow
    ctx.fillStyle = '#4B5563'
    const arrowSize = 8
    ctx.beginPath()
    ctx.moveTo(x - arrowSize, canvas.height / 2 - arrowSize)
    ctx.lineTo(x + arrowSize, canvas.height / 2)
    ctx.lineTo(x - arrowSize, canvas.height / 2 + arrowSize)
    ctx.fill()

    // Draw pattern preview
    if (type === 'note') {
      const fromNoteTemplate = fromTemplate as NoteTemplate
      const toNoteTemplate = toTemplate as NoteTemplate

      // Draw from template pattern
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)' // blue
      fromNoteTemplate.scaleDegrees.forEach((degree, i) => {
        const noteX = (transitionBar - 1) * barWidth + (i * barWidth / fromNoteTemplate.scaleDegrees.length)
        const noteY = canvas.height * (1 - degree/7)
        ctx.beginPath()
        ctx.arc(noteX, noteY, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw to template pattern
      ctx.fillStyle = 'rgba(16, 185, 129, 0.5)' // green
      toNoteTemplate.scaleDegrees.forEach((degree, i) => {
        const noteX = transitionBar * barWidth + (i * barWidth / toNoteTemplate.scaleDegrees.length)
        const noteY = canvas.height * (1 - degree/7)
        ctx.beginPath()
        ctx.arc(noteX, noteY, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    } else {
      const fromRhythmTemplate = fromTemplate as RhythmTemplate
      const toRhythmTemplate = toTemplate as RhythmTemplate

      // Draw from template pattern
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)' // blue
      let currentX = (transitionBar - 1) * barWidth
      fromRhythmTemplate.durations.forEach(duration => {
        const width = duration * barWidth
        ctx.fillRect(currentX, canvas.height - 20, width - 2, 16)
        currentX += width
      })

      // Draw to template pattern
      ctx.fillStyle = 'rgba(16, 185, 129, 0.5)' // green
      currentX = transitionBar * barWidth
      toRhythmTemplate.durations.forEach(duration => {
        const width = duration * barWidth
        ctx.fillRect(currentX, canvas.height - 20, width - 2, 16)
        currentX += width
      })
    }
  }, [fromTemplate, toTemplate, type, transitionBar])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  )
} 