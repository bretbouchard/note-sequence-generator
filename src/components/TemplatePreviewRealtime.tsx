'use client'

import { useEffect, useRef, useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { useTemplateTransitions } from '@/hooks/useTemplateTransitions'
import { useTemplateConflicts } from '@/hooks/useTemplateConflicts'

interface Props {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  currentBar: number
  totalBars: number
  onConflict?: (message: string) => void
}

export default function TemplatePreviewRealtime({
  noteTemplates,
  rhythmTemplates,
  currentBar,
  totalBars,
  onConflict
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [previewFrame, setPreviewFrame] = useState(0)
  const { getActiveTemplate } = useTemplateTransitions()
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

    // Draw timeline
    const barWidth = canvas.width / totalBars
    const halfHeight = canvas.height / 2

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1

    // Draw bar lines
    for (let i = 0; i <= totalBars; i++) {
      const x = i * barWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw horizontal divider
    ctx.beginPath()
    ctx.moveTo(0, halfHeight)
    ctx.lineTo(canvas.width, halfHeight)
    ctx.stroke()

    // Check for conflicts
    const noteConflicts = findOverlaps(noteTemplates).concat(findGaps(noteTemplates, totalBars))
    const rhythmConflicts = findOverlaps(rhythmTemplates).concat(findGaps(rhythmTemplates, totalBars))

    // Notify about conflicts
    noteConflicts.concat(rhythmConflicts).forEach(conflict => {
      onConflict?.(conflict.message)
    })

    // Draw active templates
    const activeNoteTemplate = getActiveTemplate(noteTemplates, currentBar)
    const activeRhythmTemplate = getActiveTemplate(rhythmTemplates, currentBar)

    // Draw note template preview
    if (activeNoteTemplate && 'scaleDegrees' in activeNoteTemplate) {
      const x = currentBar * barWidth
      ctx.fillStyle = '#3B82F6'
      activeNoteTemplate.scaleDegrees.forEach((degree, index) => {
        const y = halfHeight * (1 - degree/7)
        ctx.beginPath()
        ctx.arc(x + (index * 10), y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw rhythm template preview
    if (activeRhythmTemplate && 'durations' in activeRhythmTemplate) {
      const x = currentBar * barWidth
      ctx.fillStyle = '#10B981'
      let currentX = x
      activeRhythmTemplate.durations.forEach(duration => {
        const width = duration * barWidth
        ctx.fillRect(currentX, halfHeight + 10, width - 2, 20)
        currentX += width
      })
    }

    // Request next frame
    const frameId = requestAnimationFrame(() => setPreviewFrame(prev => prev + 1))

    return () => cancelAnimationFrame(frameId)
  }, [
    noteTemplates,
    rhythmTemplates,
    currentBar,
    totalBars,
    previewFrame,
    getActiveTemplate,
    findOverlaps,
    findGaps,
    onConflict
  ])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white">Real-time Preview</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-md"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <div>Bar {currentBar + 1}</div>
        <div>Total Bars: {totalBars}</div>
      </div>
    </div>
  )
} 