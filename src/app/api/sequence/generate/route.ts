import { NextResponse } from 'next/server'
import { generateSequence } from '@/lib/sequenceGenerator'
import { validateSequenceInput } from '@/lib/sequenceValidator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received sequence generation request:', body)

    const { key, scale, chordProgression, template } = body

    // Validate input
    if (!validateSequenceInput(key, scale, chordProgression, template)) {
      console.error('Invalid input parameters:', { key, scale, chordProgression, template })
      return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 })
    }

    // Generate sequence
    const sequence = await generateSequence({
      key,
      scale,
      chordProgression,
      template
    })

    console.log('Generated sequence:', sequence)
    return NextResponse.json({ sequence })
  } catch (error) {
    console.error('Error generating sequence:', error)
    return NextResponse.json({ error: 'Failed to generate sequence' }, { status: 500 })
  }
} 