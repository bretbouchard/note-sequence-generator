import { describe, it, expect } from 'vitest'
import { generateSequence } from '@/lib/sequenceGenerator'
import type { Scale, ChordProgression, NoteTemplate } from '@/types/music'

describe('Sequence Generator', () => {
  const mockOptions = {
    key: 'C',
    scale: {
      degrees: [1, 2, 3, 4, 5, 6, 7],
      intervals: [0, 2, 4, 5, 7, 9, 11]
    } as Scale,
    chordProgression: {
      degrees: [1, 4, 5],
      durations: [4, 2, 2]
    } as ChordProgression,
    template: {
      probabilities: [
        { scaleDegree: 1, weight: 0.4 },
        { scaleDegree: 3, weight: 0.3 },
        { scaleDegree: 5, weight: 0.3 }
      ]
    } as NoteTemplate
  }

  it('generates valid sequences', async () => {
    const sequence = await generateSequence(mockOptions)
    
    expect(sequence).toBeDefined()
    expect(sequence.scaleDegrees.length).toBeGreaterThan(0)
    expect(sequence.durations.length).toBe(sequence.scaleDegrees.length)
    expect(sequence.key).toBe(mockOptions.key)
  })

  it('respects duration totals', async () => {
    const sequence = await generateSequence(mockOptions)
    
    const totalDuration = sequence.durations.reduce((sum, dur) => sum + dur, 0)
    const expectedDuration = mockOptions.chordProgression.durations.reduce((sum, dur) => sum + dur, 0)
    
    expect(totalDuration).toBe(expectedDuration)
  })

  it('generates sequences within performance target', async () => {
    const startTime = performance.now()
    await generateSequence(mockOptions)
    const duration = performance.now() - startTime
    
    expect(duration).toBeLessThan(50) // 50ms target
  })
}) 