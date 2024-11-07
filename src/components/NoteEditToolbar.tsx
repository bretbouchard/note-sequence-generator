'use client'

import { useState } from 'react'
import type { NoteSequence } from '@/types/music'

interface Props {
  onQuantize: () => void
  onTranspose: (semitones: number) => void
  onAdjustDuration: (factor: number) => void
  onSnapToggle: () => void
  snapEnabled: boolean
  quantizeValue: 1 | 2 | 4 | 8 | 16
  onQuantizeValueChange: (value: 1 | 2 | 4 | 8 | 16) => void
}

export default function NoteEditToolbar({
  onQuantize,
  onTranspose,
  onAdjustDuration,
  onSnapToggle,
  snapEnabled,
  quantizeValue,
  onQuantizeValueChange
}: Props) {
  const [transposeAmount, setTransposeAmount] = useState(0)

  return (
    <div className="absolute top-4 left-4 flex gap-2 bg-gray-800 rounded-md p-2 z-10">
      {/* Quantize Controls */}
      <div className="flex items-center gap-2">
        <select
          value={quantizeValue}
          onChange={(e) => onQuantizeValueChange(Number(e.target.value) as 1 | 2 | 4 | 8 | 16)}
          className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
        >
          <option value={1}>1/1</option>
          <option value={2}>1/2</option>
          <option value={4}>1/4</option>
          <option value={8}>1/8</option>
          <option value={16}>1/16</option>
        </select>
        <button
          onClick={onQuantize}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
        >
          Quantize
        </button>
      </div>

      {/* Snap to Grid Toggle */}
      <button
        onClick={onSnapToggle}
        className={`px-3 py-1 rounded text-sm ${
          snapEnabled 
            ? 'bg-green-600 text-white hover:bg-green-500'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Snap to Grid
      </button>

      {/* Transpose Controls */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={transposeAmount}
          onChange={(e) => setTransposeAmount(parseInt(e.target.value))}
          className="w-16 bg-gray-700 text-white rounded px-2 py-1 text-sm"
        />
        <button
          onClick={() => onTranspose(transposeAmount)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
        >
          Transpose
        </button>
      </div>

      {/* Duration Controls */}
      <div className="flex gap-1">
        <button
          onClick={() => onAdjustDuration(0.5)}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
        >
          ½×
        </button>
        <button
          onClick={() => onAdjustDuration(2)}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
        >
          2×
        </button>
      </div>
    </div>
  )
} 