import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const defaultChordTypes = [
  {
    name: 'Major 7th',
    symbol: 'maj7',
    intervals: '0,4,7,11'
  },
  {
    name: 'Dominant 7th',
    symbol: '7',
    intervals: '0,4,7,10'
  },
  {
    name: 'Minor 7th',
    symbol: 'm7',
    intervals: '0,3,7,10'
  },
  {
    name: 'Half Diminished',
    symbol: 'ø7',
    intervals: '0,3,6,10'
  }
]

export async function GET() {
  try {
    let chordTypes = await prisma.chordType.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    if (chordTypes.length === 0) {
      return NextResponse.json(defaultChordTypes)
    }

    return NextResponse.json(chordTypes)
  } catch (error) {
    console.error('Error fetching chord types:', error)
    return NextResponse.json({ error: 'Failed to fetch chord types' }, { status: 500 })
  }
} 