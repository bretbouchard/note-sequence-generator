'use client'

import { useState, useRef } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  template: NoteTemplate | RhythmTemplate
  type: 'note' | 'rhythm'
  onDragStart: () => void
  onDragEnd: (position: { x: number; y: number }) => void
  onPositionChange: (startBar: number) => void
  children: React.ReactNode
}

export default function DraggableTemplate({
  template,
  type,
  onDragStart,
  onDragEnd,
  onPositionChange,
  children
}: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!elementRef.current) return

    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - elementRef.current.offsetLeft,
      y: e.clientY - elementRef.current.offsetTop
    }
    onDragStart()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartPos.current || !elementRef.current) return

    const newX = e.clientX - dragStartPos.current.x
    const newY = e.clientY - dragStartPos.current.y

    // Calculate grid position (assuming 40px per bar)
    const barWidth = 40
    const newBar = Math.round(newX / barWidth)
    
    // Update template position
    onPositionChange(newBar)

    // Update visual position
    elementRef.current.style.transform = `translate(${newX}px, ${newY}px)`
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return

    setIsDragging(false)
    dragStartPos.current = null

    // Calculate final position
    const finalPosition = {
      x: e.clientX,
      y: e.clientY
    }
    onDragEnd(finalPosition)
  }

  return (
    <div
      ref={elementRef}
      className={`relative cursor-move ${isDragging ? 'z-50' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  )
} 