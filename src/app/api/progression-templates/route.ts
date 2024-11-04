import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const templates = await prisma.progressionTemplate.findMany()
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching progression templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progression templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, pattern } = body

    const template = await prisma.progressionTemplate.create({
      data: {
        name,
        description,
        pattern: JSON.stringify(pattern)
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating progression template:', error)
    return NextResponse.json(
      { error: 'Failed to create progression template' },
      { status: 500 }
    )
  }
} 