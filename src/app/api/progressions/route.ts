import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('Fetching progressions...')
    const progressions = await prisma.chordProgression.findMany({
      include: {
        chords: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    console.log('Found progressions:', progressions)

    // Add default progression if none exist
    if (progressions.length === 0) {
      console.log('No progressions found, creating defaults...')
      const defaultProgressions = [
        {
          id: 'd5f4bfe8-988f-4b91-80eb-9fea6a58b9fb',
          name: 'I-VI-II-V',
          chords: [
            {
              degree: 'Imaj7',
              scaleDegree: '1',
              chordType: 'maj7',
              duration: 4.0,
              position: 0.0,
              chordNotesDegree: '1,3,5,7',
              order: 0
            },
            {
              degree: 'vi7',
              scaleDegree: '6',
              chordType: 'm7',
              duration: 4.0,
              position: 4.0,
              chordNotesDegree: '6,1,3,5',
              order: 1
            },
            {
              degree: 'ii7',
              scaleDegree: '2',
              chordType: 'm7',
              duration: 4.0,
              position: 8.0,
              chordNotesDegree: '2,4,6,1',
              order: 2
            },
            {
              degree: 'V7',
              scaleDegree: '5',
              chordType: '7',
              duration: 4.0,
              position: 12.0,
              chordNotesDegree: '5,7,2,4',
              order: 3
            }
          ]
        },
        {
          name: 'Minor II-V-I',
          chords: [
            {
              degree: 'iiø7',
              scaleDegree: '2',
              chordType: 'ø7',
              duration: 4.0,
              position: 0.0,
              chordNotesDegree: '2,4,6,1',
              order: 0
            },
            {
              degree: 'V7b9',
              scaleDegree: '5',
              chordType: '7',
              duration: 4.0,
              position: 4.0,
              chordNotesDegree: '5,7,2,4',
              order: 1
            },
            {
              degree: 'i7',
              scaleDegree: '1',
              chordType: 'm7',
              duration: 4.0,
              position: 8.0,
              chordNotesDegree: '1,3,5,7',
              order: 2
            }
          ]
        }
      ]

      for (const prog of defaultProgressions) {
        await prisma.chordProgression.create({
          data: {
            name: prog.name,
            chords: {
              create: prog.chords
            }
          }
        })
      }

      // Fetch again after creating defaults
      return NextResponse.json(await prisma.chordProgression.findMany({
        include: {
          chords: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      }))
    }

    return NextResponse.json(progressions)
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
          create: chords
        }
      },
      include: {
        chords: true
      }
    })

    return NextResponse.json(progression)
  } catch (error) {
    console.error('Error creating progression:', error)
    return NextResponse.json(
      { error: 'Failed to create progression' },
      { status: 500 }
    )
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