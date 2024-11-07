'use client'

import { useEffect } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface HotkeyHandlers {
  onNewTemplate?: (type: 'note' | 'rhythm') => void
  onDeleteTemplate?: () => void
  onDuplicateTemplate?: () => void
  onSaveTemplate?: () => void
  onUndo?: () => void
  onRedo?: () => void
}

export function useTemplateHotkeys(handlers: HotkeyHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Command/Control combinations
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault()
            handlers.onNewTemplate?.(e.shiftKey ? 'rhythm' : 'note')
            break
          case 'd':
            e.preventDefault()
            handlers.onDuplicateTemplate?.()
            break
          case 's':
            e.preventDefault()
            handlers.onSaveTemplate?.()
            break
          case 'z':
            e.preventDefault()
            if (e.shiftKey) {
              handlers.onRedo?.()
            } else {
              handlers.onUndo?.()
            }
            break
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handlers.onDeleteTemplate?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
} 