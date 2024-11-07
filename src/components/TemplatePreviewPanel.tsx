'use client'

import { useEffect, useRef } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  template: NoteTemplate | RhythmTemplate
  type: 'note' | 'rhythm'
  showGrid?: boolean
  height?: number
}

export default function TemplatePreviewPanel({
  template,
  type,
  showGrid = true,
  height = 120
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Setup canvas
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = '#1F2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid if enabled
    if (showGrid) {
      const gridSize = 20
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Draw template pattern
    if (type === 'note') {
      const noteTemplate = template as NoteTemplate
      const patternWidth = canvas.width / noteTemplate.scaleDegrees.length

      // Draw note points and connections
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 2
      ctx.fillStyle = '#3B82F6'

      noteTemplate.scaleDegrees.forEach((degree, i) => {
        const x = i * patternWidth + patternWidth / 2
        const y = canvas.height * (1 - degree/7)

        // Draw connecting line
        if (i > 0) {
          const prevX = (i-1) * patternWidth + patternWidth / 2
          const prevY = canvas.height * (1 - noteTemplate.scaleDegrees[i-1]/7)
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(x, y)
          ctx.stroke()
        }

        // Draw point
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    } else {
      const rhythmTemplate = template as RhythmTemplate
      const totalDuration = rhythmTemplate.durations.reduce((sum, d) => sum + d, 0)
      const unitWidth = canvas.width / totalDuration

      // Draw rhythm blocks
      let currentX = 0
      rhythmTemplate.durations.forEach((duration, i) => {
        const width = duration * unitWidth
        
        // Draw block
        ctx.fillStyle = `hsl(${i * 30}, 70%, 50%)`
        ctx.fillRect(currentX, canvas.height - 40, width - 2, 30)
        
        // Draw duration label
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '12px monospace'
        ctx.fillText(
          duration.toString(),
          currentX + width/2 - 6,
          canvas.height - 20
        )
        
        currentX += width
      })
    }
  }, [template, type, showGrid, height])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-md"
      style={{ height: `${height}px` }}
    />
  )
} 