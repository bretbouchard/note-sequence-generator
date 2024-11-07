'use client'

interface ShortcutGroup {
  title: string
  shortcuts: {
    key: string
    description: string
  }[]
}

const SHORTCUTS: ShortcutGroup[] = [
  {
    title: 'Note Editing',
    shortcuts: [
      { key: '↑/↓', description: 'Change note pitch' },
      { key: '←/→', description: 'Move note position' },
      { key: 'Shift + ←/→', description: 'Adjust note duration' },
      { key: 'Delete/Backspace', description: 'Delete selected note' },
      { key: 'Cmd/Ctrl + C', description: 'Copy selected notes' },
      { key: 'Cmd/Ctrl + V', description: 'Paste notes' },
      { key: 'Cmd/Ctrl + Z', description: 'Undo' },
      { key: 'Cmd/Ctrl + Shift + Z', description: 'Redo' }
    ]
  },
  {
    title: 'Template Management',
    shortcuts: [
      { key: 'Cmd/Ctrl + N', description: 'New note template' },
      { key: 'Cmd/Ctrl + Shift + N', description: 'New rhythm template' },
      { key: 'Cmd/Ctrl + S', description: 'Save template' },
      { key: 'Cmd/Ctrl + D', description: 'Duplicate template' }
    ]
  },
  {
    title: 'View Controls',
    shortcuts: [
      { key: 'Cmd/Ctrl + Mouse Wheel', description: 'Zoom in/out' },
      { key: 'Space', description: 'Toggle view mode' },
      { key: 'Shift + Drag', description: 'Pan view' },
      { key: 'R', description: 'Reset view' }
    ]
  }
]

export default function KeyboardShortcutsHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          {SHORTCUTS.map((group, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-gray-200 mb-3">
                {group.title}
              </h3>
              <div className="grid gap-2">
                {group.shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-200">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Press <kbd className="px-1 bg-gray-700 rounded">?</kbd> to show/hide keyboard shortcuts
          </p>
        </div>
      </div>
    </div>
  )
} 