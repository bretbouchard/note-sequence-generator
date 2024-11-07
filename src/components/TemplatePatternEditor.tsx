'use client'

import { useState, useRef, useEffect } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  template: NoteTemplate | RhythmTemplate
  type: 'note' | 'rhythm'
  onUpdate: (updatedTemplate: NoteTemplate | RhythmTemplate) => void
}

export default function TemplatePatternEditor({ template, type, onUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)

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
    ctx.fillStyle = '#1F2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    const gridSize = 40
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw pattern
    if (type === 'note') {
      const noteTemplate = template as NoteTemplate
      ctx.fillStyle = '#3B82F6'
      noteTemplate.scaleDegrees.forEach((degree, i) => {
        const x = i * (canvas.width / noteTemplate.scaleDegrees.length)
        const y = canvas.height * (1 - degree/7)
        
        // Draw point
        ctx.beginPath()
        ctx.arc(x + gridSize/2, y, selectedPoint === i ? 8 : 6, 0, Math.PI * 2)
        ctx.fill()

        // Connect points with lines
        if (i > 0) {
          const prevX = (i-1) * (canvas.width / noteTemplate.scaleDegrees.length)
          const prevY = canvas.height * (1 - noteTemplate.scaleDegrees[i-1]/7)
          ctx.strokeStyle = '#3B82F6'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(prevX + gridSize/2, prevY)
          ctx.lineTo(x + gridSize/2, y)
          ctx.stroke()
        }
      })
    } else {
      const rhythmTemplate = template as RhythmTemplate
      let currentX = 0
      rhythmTemplate.durations.forEach((duration, i) => {
        const width = duration * gridSize
        
        // Draw duration block
        ctx.fillStyle = selectedPoint === i ? '#60A5FA' : '#3B82F6'
        ctx.fillRect(currentX, canvas.height - gridSize, width - 2, gridSize - 4)
        
        currentX += width
      })
    }
  }, [template, type, selectedPoint])

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find clicked point
    if (type === 'note') {
      const noteTemplate = template as NoteTemplate
      const pointWidth = canvas.width / noteTemplate.scaleDegrees.length
      const index = Math.floor(x / pointWidth)
      setSelectedPoint(index)
    } else {
      const rhythmTemplate = template as RhythmTemplate
      let currentX = 0
      const index = rhythmTemplate.durations.findIndex((duration, i) => {
        const width = duration * 40
        const isInRange = x >= currentX && x < currentX + width
        currentX += width
        return isInRange
      })
      setSelectedPoint(index)
    }

    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || selectedPoint === null) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (type === 'note') {
      // Update note degree
      const noteTemplate = template as NoteTemplate
      const newDegree = Math.max(1, Math.min(7, 7 - Math.floor((y / canvas.height) * 7)))
      const newDegrees = [...noteTemplate.scaleDegrees]
      newDegrees[selectedPoint] = newDegree
      onUpdate({ ...noteTemplate, scaleDegrees: newDegrees })
    } else {
      // Update rhythm duration
      const rhythmTemplate = template as RhythmTemplate
      const gridSize = 40
      const newDuration = Math.max(1, Math.round((x - (selectedPoint * gridSize)) / gridSize))
      const newDurations = [...rhythmTemplate.durations]
      newDurations[selectedPoint] = newDuration
      onUpdate({ ...rhythmTemplate, durations: newDurations })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setSelectedPoint(null)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white">Edit Pattern</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-md cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <p className="text-xs text-gray-400">
        Click and drag points to adjust the pattern
      </p>
    </div>
  )
} 