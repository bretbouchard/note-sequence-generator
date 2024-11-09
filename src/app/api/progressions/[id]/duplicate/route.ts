import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch original progression
    const original = await prisma.chordProgression.findUnique({
      where: { id: params.id },
      include: {
        chords: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!original) {
      return NextResponse.json(
        { error: 'Original progression not found' },
        { status: 404 }
      )
    }

    // Create duplicate
    const duplicate = await prisma.chordProgression.create({
      data: {
        name: `${original.name} (Copy)`,
        chords: {
          create: original.chords.map((chord, index) => ({
            degree: chord.degree,
            scaleDegree: chord.scaleDegree,
            chordType: chord.chordType,
            duration: chord.duration,
            position: chord.position,
            order: index,
            chordNotesDegree: chord.chordNotesDegree
          }))
        }
      },
      include: {
        chords: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(duplicate)
  } catch (error) {
    console.error('Error duplicating progression:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate progression' },
      { status: 500 }
    )
  }
} 