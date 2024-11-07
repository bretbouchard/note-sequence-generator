'use client'

import { useEffect, useState } from 'react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

export function useGlobalShortcuts() {
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Show/hide shortcuts help with '?'
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault()
        setShowShortcutsHelp(prev => !prev)
      }

      // Reset view with 'R'
      if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        // Emit reset view event
        window.dispatchEvent(new CustomEvent('resetView'))
      }

      // Toggle view mode with Space
      if (e.key === ' ' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        // Emit toggle view event
        window.dispatchEvent(new CustomEvent('toggleView'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    showShortcutsHelp,
    setShowShortcutsHelp
  }
} 