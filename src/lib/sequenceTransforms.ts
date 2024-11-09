import type { ChordProgression } from '@/types/progression'
import type { NoteTemplate, RhythmTemplate } from '@/types/templates'

interface GenerateSequenceParams {
  progression: ChordProgression
  noteTemplates: NoteTemplate[]
  rhythmTemplates: RhythmTemplate[]
}

export function generateSequence({
  progression,
  noteTemplates,
  rhythmTemplates
}: GenerateSequenceParams) {
  console.log('=== Generate Sequence Called ===')
  console.log('Input:', {
    progression,
    noteTemplates: noteTemplates.map(t => t.name),
    rhythmTemplates: rhythmTemplates.map(t => t.name)
  })

  try {
    if (!progression.chords?.length) {
      console.error('No chords in progression')
      return null
    }

    if (!noteTemplates.length || !rhythmTemplates.length) {
      console.error('Missing templates:', { noteTemplates, rhythmTemplates })
      return null
    }

    // Select templates
    const noteTemplate = noteTemplates[0]
    const rhythmTemplate = rhythmTemplates[0]

    console.log('Using templates:', {
      note: noteTemplate.name,
      rhythm: rhythmTemplate.name
    })

    // Generate sequence for each chord
    const sequence = progression.chords.map((chord, index) => {
      console.log(`Processing chord ${index}:`, chord)

      // Parse chord notes
      const chordNotes = chord.chordNotesDegree.split(',').map(Number)
      console.log('Chord notes:', chordNotes)

      // Parse template patterns
      const scaleDegrees = noteTemplate.scaleDegrees.split(',').map(Number)
      const durations = rhythmTemplate.durations.split(',').map(Number)

      console.log('Template patterns:', { scaleDegrees, durations })

      // Generate notes
      const notes = scaleDegrees.map(degree => {
        if (noteTemplate.useChordTones) {
          return chordNotes.reduce((closest, note) => {
            return Math.abs(note - degree) < Math.abs(closest - degree) ? note : closest
          }, chordNotes[0])
        }
        return degree
      })

      console.log('Generated notes:', notes)

      return {
        chordIndex: index,
        chord: chord.degree,
        position: chord.position,
        duration: chord.duration,
        notes,
        durations,
        direction: noteTemplate.direction,
        behavior: noteTemplate.behavior
      }
    })

    console.log('=== Sequence Generation Complete ===')
    console.log('Final sequence:', sequence)
    return sequence

  } catch (error) {
    console.error('Error generating sequence:', error)
    return null
  }
} 