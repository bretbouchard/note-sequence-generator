'use client'

import { useState } from 'react'
import { useNoteEditingOperations } from '@/hooks/useNoteEditingOperations'
import type { NoteSequence } from '@/types/music'

interface Props {
  sequence: NoteSequence | null
  onSequenceUpdate: (sequence: NoteSequence) => void
}

export default function NoteEditingControls({ sequence, onSequenceUpdate }: Props) {
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [quantizeValue, setQuantizeValue] = useState<1 | 2 | 4 | 8 | 16>(4)
  
  const {
    addNote,
    deleteNote,
    moveNote,
    resizeNote,
    transposeNote,
    copyNotes,
    pasteNotes,
    undo,
    redo
  } = useNoteEditingOperations(sequence, onSequenceUpdate)

  return (
    <div className="absolute top-4 left-4 bg-gray-800 rounded-md p-3 space-y-3 z-10">
      {/* Grid Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Grid Size</label>
          <select
            value={quantizeValue}
            onChange={(e) => setQuantizeValue(Number(e.target.value) as 1 | 2 | 4 | 8 | 16)}
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
          >
            <option value={1}>1/1</option>
            <option value={2}>1/2</option>
            <option value={4}>1/4</option>
            <option value={8}>1/8</option>
            <option value={16}>1/16</option>
          </select>
        </div>
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`px-3 py-1 rounded text-sm ${
            snapToGrid
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Snap to Grid
        </button>
      </div>

      {/* Edit Controls */}
      <div className="flex gap-2">
        <button
          onClick={undo}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          title="Undo (Ctrl+Z)"
        >
          ↩
        </button>
        <button
          onClick={redo}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          title="Redo (Ctrl+Shift+Z)"
        >
          ↪
        </button>
        <button
          onClick={() => copyNotes(0, sequence?.scaleDegrees.length || 0)}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          title="Copy (Ctrl+C)"
        >
          Copy
        </button>
        <button
          onClick={() => pasteNotes(0)}
          className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          title="Paste (Ctrl+V)"
        >
          Paste
        </button>
      </div>

      {/* Note Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => addNote(0, 1)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
        >
          Add Note
        </button>
        <button
          onClick={() => deleteNote(0)}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-500"
        >
          Delete
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
        <p>Keyboard Shortcuts:</p>
        <ul className="mt-1 space-y-1">
          <li>↑/↓: Change pitch</li>
          <li>←/→: Move note</li>
          <li>Shift + ←/→: Adjust duration</li>
          <li>Delete: Remove note</li>
          <li>Ctrl+Z: Undo</li>
          <li>Ctrl+Shift+Z: Redo</li>
        </ul>
      </div>
    </div>
  )
} 