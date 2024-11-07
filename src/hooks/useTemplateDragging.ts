'use client'

import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface DragState {
  templateId: string
  type: 'note' | 'rhythm'
  startBar: number
}

export function useTemplateDragging(
  onTemplateMove: (type: 'note' | 'rhythm', templateId: string, newStartBar: number) => void
) {
  const [draggedTemplate, setDraggedTemplate] = useState<DragState | null>(null)

  const handleDragStart = useCallback((template: NoteTemplate | RhythmTemplate, type: 'note' | 'rhythm') => {
    setDraggedTemplate({
      templateId: template.id,
      type,
      startBar: template.repetition.startBar
    })
  }, [])

  const handleDragEnd = useCallback((newStartBar: number) => {
    if (!draggedTemplate) return

    onTemplateMove(draggedTemplate.type, draggedTemplate.templateId, newStartBar)
    setDraggedTemplate(null)
  }, [draggedTemplate, onTemplateMove])

  const handlePositionChange = useCallback((newStartBar: number) => {
    if (!draggedTemplate) return

    onTemplateMove(draggedTemplate.type, draggedTemplate.templateId, newStartBar)
  }, [draggedTemplate, onTemplateMove])

  return {
    draggedTemplate,
    handleDragStart,
    handleDragEnd,
    handlePositionChange
  }
} 