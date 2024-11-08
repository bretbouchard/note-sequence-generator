'use client'

interface Props {
  value: number
  index: number
  min: number
  max: number
  step: number
  formatLabel?: (value: number) => string
  onChange: (index: number, value: number) => void
}

export default function DraggableValue({ 
  value, 
  index, 
  min, 
  max, 
  step,
  formatLabel = (v) => v.toString(),
  onChange 
}: Props) {
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const relativeY = clickY / rect.height

    // Top half increases, bottom half decreases
    if (relativeY < 0.5) {
      const newValue = Math.min(max, value + step)
      if (newValue !== value) {
        onChange(index, newValue)
      }
    } else {
      const newValue = Math.max(min, value - step)
      if (newValue !== value) {
        onChange(index, newValue)
      }
    }
  }

  return (
    <div
      className="w-10 h-14 bg-blue-500 rounded flex items-center justify-center text-white cursor-pointer hover:bg-blue-400 transition-colors relative group"
      onClick={handleClick}
    >
      {/* Visual indicators for click zones */}
      <div className="absolute inset-0 flex flex-col opacity-0 group-hover:opacity-100">
        <div className="h-1/2 bg-green-400/20 rounded-t"></div>
        <div className="h-1/2 bg-red-400/20 rounded-b"></div>
      </div>
      {/* Value display */}
      <span className="relative z-10">{formatLabel(value)}</span>
    </div>
  )
} 