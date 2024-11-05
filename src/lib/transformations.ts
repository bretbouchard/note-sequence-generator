import type { NoteSequence, TransformOptions } from '@/types/music'

export const transformSequence = (
  sequence: NoteSequence,
  options: TransformOptions
): NoteSequence => {
  switch (options.type) {
    case 'reverse':
      return reverseSequence(sequence)
    case 'invert':
      return invertSequence(sequence)
    case 'transpose':
      return transposeSequence(sequence, options.value || 0)
    default:
      return sequence
  }
}

const reverseSequence = (sequence: NoteSequence): NoteSequence => {
  return {
    ...sequence,
    scaleDegrees: [...sequence.scaleDegrees].reverse(),
    durations: [...sequence.durations].reverse()
  }
}

const invertSequence = (sequence: NoteSequence): NoteSequence => {
  const maxDegree = Math.max(...sequence.scaleDegrees)
  return {
    ...sequence,
    scaleDegrees: sequence.scaleDegrees.map(degree => maxDegree - degree + 1)
  }
}

const transposeSequence = (sequence: NoteSequence, interval: number): NoteSequence => {
  return {
    ...sequence,
    scaleDegrees: sequence.scaleDegrees.map(degree => {
      const newDegree = degree + interval
      // Keep within scale bounds (1-7)
      return ((newDegree - 1) % 7) + 1
    })
  }
} 