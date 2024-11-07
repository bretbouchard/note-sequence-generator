'use client'

import { useState, useEffect } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import TemplateEditor from './TemplateEditor'

interface Props {
  type: 'note' | 'rhythm'
  onTemplateChange: (noteTemplates: NoteTemplate[], rhythmTemplates: RhythmTemplate[]) => void
}

export default function TemplateManager({ type, onTemplateChange }: Props) {
  const [noteTemplates, setNoteTemplates] = useState<NoteTemplate[]>([{
    id: 'default-note',
    scaleDegrees: [1, 2, 3, 4, 5],
    weights: [1, 1, 1, 1, 1],
    repetition: { startBar: 0, duration: 4 },
    direction: 'forward',
    behavior: 'continuous',
    useChordTones: false
  }])
  
  const [rhythmTemplates, setRhythmTemplates] = useState<RhythmTemplate[]>([{
    id: 'default-rhythm',
    durations: [1, 1, 1, 1],
    templateDuration: 4,
    repetition: { startBar: 0, duration: 4 },
    direction: 'forward',
    behavior: 'continuous'
  }])

  const [editingNoteTemplate, setEditingNoteTemplate] = useState<NoteTemplate | null>(null)
  const [editingRhythmTemplate, setEditingRhythmTemplate] = useState<RhythmTemplate | null>(null)
  const [originalNoteTemplate, setOriginalNoteTemplate] = useState<NoteTemplate | null>(null)
  const [originalRhythmTemplate, setOriginalRhythmTemplate] = useState<RhythmTemplate | null>(null)

  // Debug state changes
  useEffect(() => {
    console.log('TemplateManager noteTemplates:', noteTemplates)
  }, [noteTemplates])

  useEffect(() => {
    console.log('TemplateManager rhythmTemplates:', rhythmTemplates)
  }, [rhythmTemplates])

  // Handle real-time template updates
  const handleTemplateUpdate = (template: NoteTemplate | RhythmTemplate) => {
    console.log('handleTemplateUpdate called with:', template)
    
    if ('scaleDegrees' in template) {
      // Note template
      console.log('Updating note template')
      const newTemplates = noteTemplates.map(t => 
        t.id === template.id ? template : t
      )
      console.log('New note templates:', newTemplates)
      setNoteTemplates(newTemplates)
      onTemplateChange(newTemplates, rhythmTemplates)
    } else {
      // Rhythm template
      console.log('Updating rhythm template')
      const newTemplates = rhythmTemplates.map(t => 
        t.id === template.id ? template : t
      )
      console.log('New rhythm templates:', newTemplates)
      setRhythmTemplates(newTemplates)
      onTemplateChange(noteTemplates, newTemplates)
    }
  }

  return (
    <div className="space-y-6">
      {type === 'note' ? (
        // Note Templates UI
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">Note Templates</h3>
            <button
              onClick={() => {
                const newTemplate: NoteTemplate = {
                  id: `note-${Date.now()}`,
                  scaleDegrees: [1, 2, 3],
                  weights: [1, 1, 1],
                  repetition: { startBar: 0, duration: 4 },
                  direction: 'forward',
                  behavior: 'continuous',
                  useChordTones: false
                }
                setNoteTemplates([...noteTemplates, newTemplate])
                onTemplateChange([...noteTemplates, newTemplate], rhythmTemplates)
              }}
              className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
            >
              Add Template
            </button>
          </div>
          <div className="space-y-2">
            {noteTemplates.map(template => (
              <div
                key={template.id}
                className="p-3 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-white">
                    Scale Degrees: {template.scaleDegrees.join(', ')}
                    {template.useChordTones && ' (Arpeggio)'}
                    {template.triggerMode === 'chord' && ' (Restart on Chord)'}
                    {template.selfRepeat && ' (Self Repeat)'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingNoteTemplate(template)
                        setOriginalNoteTemplate({...template})
                      }}
                      className="px-2 py-1 bg-blue-600 rounded text-xs text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const newTemplates = noteTemplates.filter(t => t.id !== template.id)
                        setNoteTemplates(newTemplates)
                        onTemplateChange(newTemplates, rhythmTemplates)
                      }}
                      className="px-2 py-1 bg-red-600 rounded text-xs text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Rhythm Templates UI
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">Rhythm Templates</h3>
            <button
              onClick={() => {
                const newTemplate: RhythmTemplate = {
                  id: `rhythm-${Date.now()}`,
                  durations: [1, 1, 1, 1],
                  templateDuration: 4,
                  repetition: { startBar: 0, duration: 4 },
                  direction: 'forward',
                  behavior: 'continuous'
                }
                setRhythmTemplates([...rhythmTemplates, newTemplate])
                onTemplateChange(noteTemplates, [...rhythmTemplates, newTemplate])
              }}
              className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
            >
              Add Template
            </button>
          </div>
          <div className="space-y-2">
            {rhythmTemplates.map(template => (
              <div
                key={template.id}
                className="p-3 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-white">
                    Durations: {template.durations.join(', ')}
                    {template.triggerMode === 'chord' && ' (Restart on Chord)'}
                    {template.selfRepeat && ' (Self Repeat)'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRhythmTemplate(template)
                        setOriginalRhythmTemplate({...template})
                      }}
                      className="px-2 py-1 bg-blue-600 rounded text-xs text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const newTemplates = rhythmTemplates.filter(t => t.id !== template.id)
                        setRhythmTemplates(newTemplates)
                        onTemplateChange(noteTemplates, newTemplates)
                      }}
                      className="px-2 py-1 bg-red-600 rounded text-xs text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Editors */}
      {editingNoteTemplate && (
        <TemplateEditor
          type="note"
          template={editingNoteTemplate}
          onUpdate={handleTemplateUpdate}
          onSave={() => {
            setEditingNoteTemplate(null)
            setOriginalNoteTemplate(null)
          }}
          onCancel={() => {
            if (originalNoteTemplate) {
              handleTemplateUpdate(originalNoteTemplate)
            }
            setEditingNoteTemplate(null)
            setOriginalNoteTemplate(null)
          }}
        />
      )}

      {editingRhythmTemplate && (
        <TemplateEditor
          type="rhythm"
          template={editingRhythmTemplate}
          onUpdate={handleTemplateUpdate}
          onSave={() => {
            setEditingRhythmTemplate(null)
            setOriginalRhythmTemplate(null)
          }}
          onCancel={() => {
            if (originalRhythmTemplate) {
              handleTemplateUpdate(originalRhythmTemplate)
            }
            setEditingRhythmTemplate(null)
            setOriginalRhythmTemplate(null)
          }}
        />
      )}
    </div>
  )
} 