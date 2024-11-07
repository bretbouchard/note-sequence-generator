'use client'

import { useState } from 'react'

interface Props {
  quantizeValue: 1 | 2 | 4 | 8 | 16
  onQuantizeValueChange: (value: 1 | 2 | 4 | 8 | 16) => void
  snapEnabled: boolean
  onSnapToggle: () => void
  onQuantizeNotes: () => void
}

export default function GridSettings({
  quantizeValue,
  onQuantizeValueChange,
  snapEnabled,
  onSnapToggle,
  onQuantizeNotes
}: Props) {
  const gridValues = [
    { value: 1, label: '1/1' },
    { value: 2, label: '1/2' },
    { value: 4, label: '1/4' },
    { value: 8, label: '1/8' },
    { value: 16, label: '1/16' }
  ] as const

  return (
    <div className="absolute top-4 left-4 bg-gray-800 rounded-md p-3 space-y-3 z-10">
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Grid Size</label>
        <div className="flex gap-2">
          {gridValues.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onQuantizeValueChange(value)}
              className={`px-2 py-1 rounded text-sm ${
                quantizeValue === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
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

        <button
          onClick={onQuantizeNotes}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
        >
          Quantize Notes
        </button>
      </div>
    </div>
  )
} 