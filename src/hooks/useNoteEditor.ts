'use client'

import { useState, useCallback } from 'react'
import type { NoteTemplate, RhythmTemplate, NoteSequence } from '@/types/music'

interface NoteEdit {
  index: number
  scaleDegree: number
  duration: number
}

export function useNoteEditor(
  sequence: NoteSequence | null,
  noteTemplates: NoteTemplate[],
  rhythmTemplates: RhythmTemplate[],
  onSequenceUpdate: (sequence: NoteSequence) => void
) {
  const [selectedNote, setSelectedNote] = useState<NoteEdit | null>(null)
  const [editMode, setEditMode] = useState<'move' | 'resize' | null>(null)

  // Find which template is active at a given position
  const findActiveTemplates = useCallback((beat: number) => {
    const bar = Math.floor(beat / 4) // Assuming 4/4 time
    
    const activeNoteTemplate = noteTemplates.find(t => 
      bar >= t.repetition.startBar && 
      bar < t.repetition.startBar + t.repetition.duration
    )

    const activeRhythmTemplate = rhythmTemplates.find(t => 
      bar >= t.repetition.startBar && 
      bar < t.repetition.startBar + t.repetition.duration
    )

    return { activeNoteTemplate, activeRhythmTemplate }
  }, [noteTemplates, rhythmTemplates])

  // Handle note editing
  const handleNoteEdit = useCallback((edit: NoteEdit) => {
    if (!sequence) return

    const { activeNoteTemplate, activeRhythmTemplate } = findActiveTemplates(edit.index * 4)
    
    // Create updated sequence
    const updatedSequence: NoteSequence = {
      ...sequence,
      scaleDegrees: [...sequence.scaleDegrees],
      durations: [...sequence.durations]
    }

    // Update note degree
    if (activeNoteTemplate) {
      // Ensure note follows template pattern
      const patternIndex = edit.index % activeNoteTemplate.scaleDegrees.length
      const allowedDegrees = activeNoteTemplate.scaleDegrees
      const closestDegree = allowedDegrees.reduce((prev, curr) => 
        Math.abs(curr - edit.scaleDegree) < Math.abs(prev - edit.scaleDegree) ? curr : prev
      )
      updatedSequence.scaleDegrees[edit.index] = closestDegree
    } else {
      updatedSequence.scaleDegrees[edit.index] = edit.scaleDegree
    }

    // Update note duration
    if (activeRhythmTemplate) {
      // Ensure duration follows template pattern
      const patternIndex = edit.index % activeRhythmTemplate.durations.length
      const allowedDurations = activeRhythmTemplate.durations
      const closestDuration = allowedDurations.reduce((prev, curr) => 
        Math.abs(curr - edit.duration) < Math.abs(prev - edit.duration) ? curr : prev
      )
      updatedSequence.durations[edit.index] = closestDuration
    } else {
      updatedSequence.durations[edit.index] = edit.duration
    }

    onSequenceUpdate(updatedSequence)
  }, [sequence, findActiveTemplates, onSequenceUpdate])

  // Handle note selection
  const handleNoteSelect = useCallback((index: number) => {
    if (!sequence) return

    setSelectedNote({
      index,
      scaleDegree: sequence.scaleDegrees[index],
      duration: sequence.durations[index]
    })
  }, [sequence])

  // Handle note deselection
  const handleNoteDeselect = useCallback(() => {
    setSelectedNote(null)
    setEditMode(null)
  }, [])

  return {
    selectedNote,
    editMode,
    setEditMode,
    handleNoteEdit,
    handleNoteSelect,
    handleNoteDeselect,
    findActiveTemplates
  }
} 