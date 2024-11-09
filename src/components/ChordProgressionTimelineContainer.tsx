'use client'

import { useState } from 'react'
import ChordProgressionTimeline from './ChordProgressionTimeline'
import type { ChordProgression } from '@/types/progression'

interface Props {
  progression: ChordProgression
  onChange: (progression: ChordProgression) => void
}

export default function ChordProgressionTimelineContainer({ progression, onChange }: Props) {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
          className="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600"
        >
          Zoom Out
        </button>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.25))}
          className="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600"
        >
          Zoom In
        </button>
      </div>

      <ChordProgressionTimeline
        progression={progression}
        onChange={onChange}
        zoom={zoom}
      />
    </div>
  )
} 