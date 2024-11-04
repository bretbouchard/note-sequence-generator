import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const progressions = await prisma.chordProgression.findMany({
      include: {
        chords: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Transform data to match expected format
    const formattedProgressions = progressions.map(progression => ({
      id: progression.id,
      name: progression.name,
      chords: progression.chords.map(chord => ({
        id: chord.id,
        degree: chord.degree,
        scale_degree: chord.scaleDegree,
        chord_notes_degree: JSON.parse(chord.chordNotesDegree)
      }))
    }))

    return NextResponse.json(formattedProgressions)
  } catch (error) {
    console.error('Error fetching progressions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progressions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, chords } = body

    const progression = await prisma.chordProgression.create({
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
    console.error('Error creating progression:', error)
    return NextResponse.json({ error: 'Failed to create progression' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, chords } = body

    // Delete existing chords
    await prisma.chordInProgression.deleteMany({
      where: { progressionId: id }
    })

    // Update progression and create new chords
    const progression = await prisma.chordProgression.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update progression' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await prisma.chordInProgression.deleteMany({
      where: { progressionId: id }
    })

    await prisma.chordProgression.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting progression:', error)
    return NextResponse.json({ error: 'Failed to delete progression' }, { status: 500 })
  }
} 