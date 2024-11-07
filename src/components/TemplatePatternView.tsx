'use client'

import { useEffect, useRef, useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { useTemplateTransitions } from '@/hooks/useTemplateTransitions'

interface Props {
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
  totalBars: number
  onTemplateClick?: (type: 'note' | 'rhythm', templateId: string) => void
  onTemplateUpdate?: (
    type: 'note' | 'rhythm',
    templateId: string,
    updates: Partial<NoteTemplate | RhythmTemplate>
  ) => void
}

interface DragState {
  type: 'note' | 'rhythm'
  templateId: string
  pointIndex?: number
  startX: number
  startY: number
  isDragging: boolean
}

export default function TemplatePatternView({
  noteTemplates,
  rhythmTemplates,
  totalBars,
  onTemplateClick,
  onTemplateUpdate
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const { findTransitionPoints } = useTemplateTransitions()

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

      // Bar numbers
      ctx.fillStyle = '#9CA3AF'
      ctx.font = '12px monospace'
      ctx.fillText(`${i + 1}`, x + 4, 16)
    }

    // Draw horizontal divider
    ctx.beginPath()
    ctx.moveTo(0, halfHeight)
    ctx.lineTo(canvas.width, halfHeight)
    ctx.stroke()

    // Draw note templates
    const noteTransitions = findTransitionPoints(noteTemplates)
    noteTemplates.forEach((template, index) => {
      const startX = template.repetition.startBar * barWidth
      const width = template.repetition.duration * barWidth

      // Template region
      ctx.fillStyle = `hsla(${(index * 60) % 360}, 70%, 50%, 0.2)`
      ctx.fillRect(startX, 0, width, halfHeight)

      // Template pattern preview
      ctx.fillStyle = `hsl(${(index * 60) % 360}, 70%, 50%)`
      template.scaleDegrees.forEach((degree, i) => {
        const x = startX + (i * width / template.scaleDegrees.length)
        const y = halfHeight * (1 - degree/7)
        ctx.beginPath()
        ctx.arc(x + width/(2 * template.scaleDegrees.length), y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Template label
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px monospace'
      ctx.fillText(
        `${template.scaleDegrees.join(', ')} (${template.repetition.duration} bars)`,
        startX + 4,
        24
      )
    })

    // Draw rhythm templates
    const rhythmTransitions = findTransitionPoints(rhythmTemplates)
    rhythmTemplates.forEach((template, index) => {
      const startX = template.repetition.startBar * barWidth
      const width = template.repetition.duration * barWidth

      // Template region
      ctx.fillStyle = `hsla(${(index * 60 + 120) % 360}, 70%, 50%, 0.2)`
      ctx.fillRect(startX, halfHeight, width, halfHeight)

      // Template pattern preview
      let currentX = startX
      template.durations.forEach(duration => {
        const blockWidth = duration * barWidth / template.templateDuration
        ctx.fillStyle = `hsl(${(index * 60 + 120) % 360}, 70%, 50%)`
        ctx.fillRect(currentX, halfHeight + 20, blockWidth - 2, 20)
        currentX += blockWidth
      })

      // Template label
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px monospace'
      ctx.fillText(
        `${template.durations.join(', ')} (${template.repetition.duration} bars)`,
        startX + 4,
        halfHeight + 50
      )
    })

    // Draw transitions
    const drawTransition = (transition: ReturnType<typeof findTransitionPoints>[0], y: number) => {
      const x = transition.bar * barWidth
      ctx.strokeStyle = '#60A5FA'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(x, y - 10)
      ctx.lineTo(x, y + 10)
      ctx.stroke()
      ctx.setLineDash([])
    }

    noteTransitions.forEach(t => drawTransition(t, halfHeight / 2))
    rhythmTransitions.forEach(t => drawTransition(t, halfHeight * 1.5))

  }, [noteTemplates, rhythmTemplates, totalBars, findTransitionPoints])

  // Add mouse handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const halfHeight = rect.height / 2

    // Find clicked template and point
    const templates = y < halfHeight ? noteTemplates : rhythmTemplates
    const type = y < halfHeight ? 'note' : 'rhythm'
    const barWidth = rect.width / totalBars
    const clickedBar = Math.floor(x / barWidth)

    const clickedTemplate = templates.find(t => 
      clickedBar >= t.repetition.startBar && 
      clickedBar < t.repetition.startBar + t.repetition.duration
    )

    if (clickedTemplate) {
      // Check if clicking on a point
      if (type === 'note') {
        const template = clickedTemplate as NoteTemplate
        const pointIndex = template.scaleDegrees.findIndex((_, i) => {
          const pointX = (template.repetition.startBar + i * template.repetition.duration / template.scaleDegrees.length) * barWidth
          const pointY = halfHeight * (1 - template.scaleDegrees[i]/7)
          return Math.abs(x - pointX) < 10 && Math.abs(y - pointY) < 10
        })

        setDragState({
          type,
          templateId: clickedTemplate.id,
          pointIndex: pointIndex >= 0 ? pointIndex : undefined,
          startX: x,
          startY: y,
          isDragging: true
        })
      } else {
        // For rhythm templates, allow dragging duration blocks
        setDragState({
          type,
          templateId: clickedTemplate.id,
          startX: x,
          startY: y,
          isDragging: true
        })
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState?.isDragging || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const deltaX = x - dragState.startX
    const deltaY = y - dragState.startY
    const barWidth = rect.width / totalBars
    const halfHeight = rect.height / 2

    if (dragState.type === 'note' && dragState.pointIndex !== undefined) {
      // Dragging a note point
      const template = noteTemplates.find(t => t.id === dragState.templateId) as NoteTemplate
      if (!template) return

      const newDegree = Math.max(1, Math.min(7, 
        7 - (y / halfHeight) * 7
      ))

      const updatedTemplate = {
        ...template,
        scaleDegrees: template.scaleDegrees.map((deg, i) => 
          i === dragState.pointIndex ? Math.round(newDegree) : deg
        )
      }

      onTemplateUpdate?.('note', template.id, updatedTemplate)
    } else {
      // Dragging template position or duration
      const template = dragState.type === 'note' 
        ? noteTemplates.find(t => t.id === dragState.templateId)
        : rhythmTemplates.find(t => t.id === dragState.templateId)

      if (!template) return

      const deltaBars = Math.round(deltaX / barWidth)
      const newStartBar = Math.max(0, Math.min(
        totalBars - template.repetition.duration,
        template.repetition.startBar + deltaBars
      ))

      onTemplateUpdate?.(dragState.type, template.id, {
        ...template,
        repetition: {
          ...template.repetition,
          startBar: newStartBar
        }
      })
    }
  }

  const handleMouseUp = () => {
    setDragState(null)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white">Template Patterns</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-md cursor-pointer"
        style={{ imageRendering: 'pixelated' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <div>Bar 1</div>
        <div>Bar {totalBars}</div>
      </div>
    </div>
  )
} 