import { PrismaClient } from '@prisma/client'
import chordProgressions from '../src/data/ChordProgressions.json'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.chordInProgression.deleteMany()
  await prisma.chordProgression.deleteMany()

  // Create progressions from JSON data
  for (const progression of chordProgressions) {
    const created = await prisma.chordProgression.create({
      data: {
        id: progression.id, // Keep original IDs
        name: progression.name,
        chords: {
          create: progression.chords.map((chord, index) => ({
            id: chord.id, // Keep original IDs
            degree: chord.degree,
            scaleDegree: chord.scale_degree,
            chordType: getChordType(chord.degree), // Extract chord type from degree
            duration: 4.0, // Default duration
            position: index * 4.0, // Position based on index
            order: index,
            chordNotesDegree: chord.chord_notes_degree.join(',') // Convert array to string
          }))
        }
      }
    })
    console.log(`Created progression: ${created.name}`)
  }

  console.log('Seeding finished')
}

// Helper function to extract chord type from degree
function getChordType(degree: string): string {
  if (!degree) return 'maj7' // Default to maj7 if empty
  
  if (degree.includes('maj7')) return 'maj7'
  if (degree.includes('m7') || degree.includes('min7')) return 'm7'
  if (degree.includes('ø') || degree.includes('ø7')) return 'ø7'
  if (degree.includes('°') || degree.includes('°7')) return '°7'
  if (degree.includes('7')) return '7'
  if (degree.toLowerCase().includes('m') || degree.includes('min')) return 'm'
  
  return 'maj' // Default to major if no type specified
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 