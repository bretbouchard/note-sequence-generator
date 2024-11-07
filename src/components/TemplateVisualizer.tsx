'use client'

import { useEffect, useRef } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { useTemplateConflicts } from '@/hooks/useTemplateConflicts'

interface Props {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  totalBars: number
  onTemplateClick?: (type: 'note' | 'rhythm', templateId: string) => void
}

export default function TemplateVisualizer({
  noteTemplates,
  rhythmTemplates,
  totalBars,
  onTemplateClick
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { findOverlaps, findGaps } = useTemplateConflicts()

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

    // Draw grid
    const barWidth = canvas.width / totalBars
    const halfHeight = canvas.height / 2

    // Draw bar lines and numbers
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    for (let i = 0; i <= totalBars; i++) {
      const x = i * barWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()

      // Bar numbers
      ctx.fillStyle = '#9CA3AF'
      ctx.font = '12px monospace'
      ctx.fillText(`${i + 1}`, x + 4, 16)
    }

    // Find conflicts
    const noteConflicts = findOverlaps(noteTemplates)
    const rhythmConflicts = findOverlaps(rhythmTemplates)
    const noteGaps = findGaps(noteTemplates, totalBars)
    const rhythmGaps = findGaps(rhythmTemplates, totalBars)

    // Draw note templates
    noteTemplates.forEach((template, index) => {
      const startX = template.repetition.startBar * barWidth
      const width = template.repetition.duration * barWidth
      const hasConflict = noteConflicts.some(c => 
        c.templates.some(t => t.id === template.id)
      )
      const hasGap = noteGaps.some(g => 
        g.templates.some(t => t.id === template.id)
      )

      // Template background
      ctx.fillStyle = hasConflict 
        ? 'rgba(239, 68, 68, 0.2)'  // red for conflict
        : hasGap 
          ? 'rgba(245, 158, 11, 0.2)'  // yellow for gap
          : `hsla(${index * 60}, 70%, 50%, 0.2)`
      ctx.fillRect(startX, 0, width, halfHeight)

      // Template border
      ctx.strokeStyle = hasConflict 
        ? '#EF4444'  // red
        : hasGap 
          ? '#F59E0B'  // yellow
          : `hsl(${index * 60}, 70%, 50%)`
      ctx.lineWidth = 2
      ctx.strokeRect(startX, 0, width, halfHeight)

      // Template pattern preview
      ctx.fillStyle = `hsl(${index * 60}, 70%, 50%)`
      template.scaleDegrees.forEach((degree, i) => {
        const x = startX + (i * width / template.scaleDegrees.length)
        const y = halfHeight * (1 - degree/7)
        ctx.beginPath()
        ctx.arc(x + width/(2 * template.scaleDegrees.length), y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    })

    // Draw rhythm templates with similar conflict visualization
    // ... (similar code for rhythm templates)

  }, [noteTemplates, rhythmTemplates, totalBars, findOverlaps, findGaps])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white">Template Visualization</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-md"
        style={{ imageRendering: 'pixelated' }}
        onClick={(e) => {
          // Handle click events for template selection
          const rect = canvasRef.current?.getBoundingClientRect()
          if (!rect) return

          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const barWidth = rect.width / totalBars
          const clickedBar = Math.floor(x / barWidth)
          const isUpperHalf = y < rect.height / 2

          const templates = isUpperHalf ? noteTemplates : rhythmTemplates
          const type = isUpperHalf ? 'note' : 'rhythm'

          const clickedTemplate = templates.find(t => 
            clickedBar >= t.repetition.startBar && 
            clickedBar < t.repetition.startBar + t.repetition.duration
          )

          if (clickedTemplate && onTemplateClick) {
            onTemplateClick(type, clickedTemplate.id)
          }
        }}
      />
    </div>
  )
} 