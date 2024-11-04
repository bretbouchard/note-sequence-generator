import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { transformSequence } from '@/lib/sequenceTransforms'
import type { TransformOptions, NoteSequence } from '@/types/music'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  try {
    const sequence = await prisma.sequence.findUnique({
      where: { id }
    })

    if (!sequence) {
      return NextResponse.json(
        { error: 'Sequence not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      sequence: {
        ...sequence,
        scaleDegrees: JSON.parse(sequence.scaleDegrees),
        durations: JSON.parse(sequence.durations)
      }
    })
  } catch (error) {
    console.error('Error fetching sequence:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sequence' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { transform } = body as { transform: TransformOptions }

    const sequence = await prisma.sequence.findUnique({
      where: { id }
    })

    if (!sequence) {
      return NextResponse.json(
        { error: 'Sequence not found' },
        { status: 404 }
      )
    }

    const parsedSequence: NoteSequence = {
      ...sequence,
      scaleDegrees: JSON.parse(sequence.scaleDegrees),
      durations: JSON.parse(sequence.durations)
    }

    const transformedSequence = transformSequence(parsedSequence, transform)

    const updatedSequence = await prisma.sequence.update({
      where: { id },
      data: {
        scaleDegrees: JSON.stringify(transformedSequence.scaleDegrees),
        durations: JSON.stringify(transformedSequence.durations)
      }
    })

    return NextResponse.json({ 
      sequence: {
        ...updatedSequence,
        scaleDegrees: JSON.parse(updatedSequence.scaleDegrees),
        durations: JSON.parse(updatedSequence.durations)
      }
    })
  } catch (error) {
    console.error('Sequence transformation error:', error)
    return NextResponse.json(
      { error: 'Failed to transform sequence' },
      { status: 500 }
    )
  }
} 