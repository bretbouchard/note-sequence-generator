import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma client with global caching for development
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return NextResponse.json(
        { error: 'Missing progression ID' },
        { status: 400 }
      )
    }

    const progression = await prisma.chordProgression.findUnique({
      where: {
        id: context.params.id
      },
      include: {
        chords: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!progression) {
      return NextResponse.json(
        { error: 'Progression not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(progression)
  } catch (error) {
    console.error('API Error:', error)
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
    const segments = request.url.split('/')
    const id = segments[segments.length - 1]

    const body = await request.json()
    const { name, chords } = body

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
          create: chords
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
    const segments = request.url.split('/')
    const id = segments[segments.length - 1]

    await prisma.chordInProgression.deleteMany({
      where: { progressionId: id }
    })

    await prisma.chordProgression.delete({
      where: { id }
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