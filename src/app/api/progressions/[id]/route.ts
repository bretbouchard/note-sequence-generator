import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const progression = await prisma.chordProgression.findUnique({
      where: { id: params.id },
      include: {
        chords: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!progression) {
      return NextResponse.json({ error: 'Progression not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: progression.id,
      name: progression.name,
      chords: progression.chords.map(chord => ({
        id: chord.id,
        degree: chord.degree,
        scale_degree: chord.scaleDegree,
        chord_notes_degree: JSON.parse(chord.chordNotesDegree)
      }))
    })
  } catch (error) {
    console.error('Error fetching progression:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progression' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, chords } = body

    // Delete existing chords
    await prisma.chordInProgression.deleteMany({
      where: { progressionId: params.id }
    })

    // Update progression and create new chords
    const progression = await prisma.chordProgression.update({
      where: { id: params.id },
      data: {
        name,
        chords: {
          create: chords.map((chord: any, index: number) => ({
            id: chord.id,
            degree: chord.degree,
            scaleDegree: chord.scale_degree,
            chordNotesDegree: JSON.stringify(chord.chord_notes_degree),
            order: index
          }))
        }
      },
      include: {
        chords: true
      }
    })

    return NextResponse.json(progression)
  } catch (error) {
    console.error('Error updating progression:', error)
    return NextResponse.json(
      { error: 'Failed to update progression' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete associated chords first
    await prisma.chordInProgression.deleteMany({
      where: { progressionId: params.id }
    })

    // Delete the progression
    await prisma.chordProgression.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting progression:', error)
    return NextResponse.json(
      { error: 'Failed to delete progression' },
      { status: 500 }
    )
  }
} 