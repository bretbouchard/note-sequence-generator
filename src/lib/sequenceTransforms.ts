import { NoteSequence, TransformOptions } from '@/types/music'

export const transformSequence = (
  sequence: NoteSequence,
  options: TransformOptions
): NoteSequence => {
  const { type, value = 0 } = options
  const newSequence = { ...sequence }

  switch (type) {
    case 'reverse':
      newSequence.scaleDegrees = [...sequence.scaleDegrees].reverse()
      newSequence.durations = [...sequence.durations].reverse()
      break

    case 'invert':
      const maxDegree = Math.max(...sequence.scaleDegrees)
      newSequence.scaleDegrees = sequence.scaleDegrees.map(
        degree => maxDegree - degree + 1
      )
      break

    case 'transpose':
      newSequence.scaleDegrees = sequence.scaleDegrees.map(
        degree => ((degree + value - 1) % 7) + 1
      )
      break

    default:
      throw new Error(`Unknown transformation type: ${type}`)
  }

  return newSequence
} 