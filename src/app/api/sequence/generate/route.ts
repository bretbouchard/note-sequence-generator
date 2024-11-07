import { NextResponse } from 'next/server'
import type { ChordProgression } from '@/types/music'
import { generateSequenceServer } from '@/lib/sequenceGeneratorServer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received sequence generation request:', JSON.stringify(body, null, 2))

    // Ensure all required fields exist
    if (!body.key || !body.scale || !body.chordProgression || !body.template) {
      throw new Error('Missing required fields in request body')
    }

    // Extract chord symbols and degrees from the progression
    const chordProgression: ChordProgression = {
      degrees: body.chordProgression.chords.map((chord: any) => chord.degree),
      durations: body.chordProgression.chords.map(() => 4)
    }

    console.log('Extracted chord progression:', {
      original: body.chordProgression,
      converted: chordProgression
    })

    // Prepare template options
    const templateOptions = {
      key: body.key,
      scale: body.scale,
      chordProgression,
      template: {
        sequenceLength: chordProgression.degrees.length * 4,
        noteTemplates: body.template.noteTemplates,
        rhythmTemplates: body.template.rhythmTemplates,
        seeds: body.template.seeds
      }
    }

    console.log('Processing template options:', JSON.stringify(templateOptions, null, 2))

    // Generate sequence
    const sequence = generateSequenceServer(templateOptions)
    console.log('Generated sequence:', JSON.stringify(sequence, null, 2))

    return NextResponse.json(sequence)

  } catch (error) {
    console.error('Error generating sequence:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate sequence' },
      { status: 500 }
    )
  }
} 