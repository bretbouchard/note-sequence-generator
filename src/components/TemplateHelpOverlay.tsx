'use client'

import { useState } from 'react'

export default function TemplateHelpOverlay() {
  const [isVisible, setIsVisible] = useState(false)

  const shortcuts = [
    { key: 'Ctrl/Cmd + N', description: 'New note template' },
    { key: 'Ctrl/Cmd + Shift + N', description: 'New rhythm template' },
    { key: 'Ctrl/Cmd + S', description: 'Save template' },
    { key: 'Ctrl/Cmd + D', description: 'Duplicate template' },
    { key: 'Delete', description: 'Delete template' },
    { key: 'Ctrl/Cmd + Z', description: 'Undo' },
    { key: 'Ctrl/Cmd + Shift + Z', description: 'Redo' }
  ]

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"
      >
        ?
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Keyboard Shortcuts</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-200">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 