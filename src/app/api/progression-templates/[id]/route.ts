import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.progressionTemplate.findUnique({
      where: { id: params.id }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Progression template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error fetching progression template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progression template' },
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
    const { name, description, pattern } = body

    const template = await prisma.progressionTemplate.update({
      where: { id: params.id },
      data: {
        name,
        description,
        pattern: JSON.stringify(pattern)
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating progression template:', error)
    return NextResponse.json(
      { error: 'Failed to update progression template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.progressionTemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting progression template:', error)
    return NextResponse.json(
      { error: 'Failed to delete progression template' },
      { status: 500 }
    )
  }
} 