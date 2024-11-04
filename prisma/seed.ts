import { PrismaClient } from '@prisma/client'
import chordProgressionsData from '../src/data/ChordProgressions.json'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.chordInProgression.deleteMany()
  await prisma.chordProgression.deleteMany()

  // Seed chord progressions
  for (const progression of chordProgressionsData) {
    await prisma.chordProgression.create({
      data: {
        id: progression.id,
        name: progression.name,
        chords: {
          create: progression.chords.map((chord, index) => ({
            id: chord.id,
            degree: chord.degree,
            scaleDegree: chord.scale_degree,
            chordNotesDegree: JSON.stringify(chord.chord_notes_degree),
            order: index
          }))
        }
      }
    })
  }

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 