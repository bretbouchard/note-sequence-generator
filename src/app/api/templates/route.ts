import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Default templates that will always be available
const defaultNoteTemplates = [
  {
    id: 'basic-scale',
    name: "Basic Scale",
    scaleDegrees: "1,2,3,4,5",
    weights: "1,1,1,1,1",
    repetition: JSON.stringify({ startBar: 0, duration: 4 }),
    direction: "forward",
    behavior: "continuous",
    useChordTones: true
  }
]

const defaultRhythmTemplates = [
  {
    id: 'quarter-notes',
    name: "Quarter Notes",
    durations: "1,1,1,1",
    templateDuration: 4,
    repetition: JSON.stringify({ startBar: 0, duration: 4 }),
    direction: "forward",
    behavior: "continuous"
  }
]

export async function GET() {
  console.log('Templates GET request received')
  try {
    // Return default templates directly
    const templates = {
      noteTemplates: defaultNoteTemplates,
      rhythmTemplates: defaultRhythmTemplates
    }
    console.log('Returning templates:', templates)
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error in templates GET:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, template } = body

    if (type === 'note') {
      const noteTemplate = await prisma.noteTemplate.create({
        data: template
      })
      return NextResponse.json(noteTemplate)
    } else if (type === 'rhythm') {
      const rhythmTemplate = await prisma.rhythmTemplate.create({
        data: template
      })
      return NextResponse.json(rhythmTemplate)
    }

    return NextResponse.json({ error: 'Invalid template type' }, { status: 400 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
} 