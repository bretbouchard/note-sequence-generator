'use client'

interface Props {
  value: number
  index: number
  min: number
  max: number
  onChange: (index: number, value: number) => void
}

export default function DraggableNote({ value, index, min, max, onChange }: Props) {
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('Mouse down on note:', { value, index })
    
    const startY = e.clientY
    const startValue = value

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY
      const step = Math.floor(deltaY / 10) // 10px per step
      const newValue = Math.max(min, Math.min(max, startValue - step))
      
      console.log('Dragging:', {
        deltaY,
        step,
        newValue,
        current: value
      })

      if (newValue !== value) {
        onChange(index, newValue)
      }
    }

    const handleMouseUp = () => {
      console.log('Mouse up, final value:', value)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white cursor-ns-resize"
      onMouseDown={handleMouseDown}
    >
      {value}
    </div>
  )
} 