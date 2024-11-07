'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  value: number
  index: number
  min: number
  max: number
  onChange: (index: number, value: number) => void
}

export default function DraggableNote({ value, index, min, max, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef<number>(0)
  const startValue = useRef<number>(0)
  const dragRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      e.preventDefault()
      const deltaY = startY.current - e.clientY
      const step = Math.round(deltaY / 20) // Increased sensitivity
      const newValue = Math.max(min, Math.min(max, startValue.current + step))
      
      console.log('Dragging:', { deltaY, step, newValue, current: value })
      if (newValue !== value) {
        onChange(index, newValue)
      }
    }

    const handleMouseUp = () => {
      console.log('Mouse up, final value:', value)
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, value, index, min, max, onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Mouse down on note:', { value, index })
    setIsDragging(true)
    startY.current = e.clientY
    startValue.current = value
  }

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className={`
        w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center
        cursor-ns-resize select-none transition-colors relative
        ${isDragging ? 'bg-blue-400 ring-2 ring-blue-300' : 'hover:bg-blue-500'}
      `}
      style={{
        cursor: 'ns-resize',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <span className="text-white font-medium">{value}</span>
      {isDragging && (
        <div className="absolute inset-0 bg-blue-300/20 rounded-md animate-pulse" />
      )}
    </div>
  )
} 