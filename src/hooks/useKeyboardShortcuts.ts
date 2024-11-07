'use client'

import { useEffect, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface ShortcutHandlers {
  onDelete?: () => void
  onCopy?: () => void
  onPaste?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
  onNewTemplate?: (type: 'note' | 'rhythm') => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if we're in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    // Command/Control + key combinations
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'c': // Copy
          e.preventDefault()
          handlers.onCopy?.()
          break
        case 'v': // Paste
          e.preventDefault()
          handlers.onPaste?.()
          break
        case 'z': // Undo/Redo
          e.preventDefault()
          if (e.shiftKey) {
            handlers.onRedo?.()
          } else {
            handlers.onUndo?.()
          }
          break
        case 's': // Save
          e.preventDefault()
          handlers.onSave?.()
          break
        case 'n': // New Template
          e.preventDefault()
          if (e.shiftKey) {
            handlers.onNewTemplate?.('rhythm')
          } else {
            handlers.onNewTemplate?.('note')
          }
          break
      }
      return
    }

    // Single key shortcuts
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        if (!e.metaKey && !e.ctrlKey) {
          handlers.onDelete?.()
        }
        break
    }
  }, [handlers])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
} 