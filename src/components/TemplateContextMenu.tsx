'use client'

import { useEffect, useRef, useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface Props {
  template: NoteTemplate | RhythmTemplate
  position: { x: number, y: number }
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onSaveAsPreset: () => void
}

export default function TemplateContextMenu({
  template,
  position,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onSaveAsPreset
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const menuItems = [
    { label: 'Edit', onClick: onEdit, icon: '✏️' },
    { label: 'Duplicate', onClick: onDuplicate, icon: '📋' },
    { label: 'Save as Preset', onClick: onSaveAsPreset, icon: '💾' },
    { label: 'Delete', onClick: onDelete, icon: '🗑️', className: 'text-red-400 hover:text-red-300' }
  ]

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800 rounded-md shadow-lg py-1 z-50"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.onClick()
            onClose()
          }}
          className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-700 flex items-center gap-2
            ${item.className || 'text-gray-200 hover:text-white'}`}
        >
          <span className="w-5">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
} 