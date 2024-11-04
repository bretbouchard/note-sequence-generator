import type { ChordProgressionData } from '@/types/music'

export async function createProgression(progression: Omit<ChordProgressionData, 'id'>) {
  const response = await fetch('/api/progressions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progression)
  })
  return response.json()
}

export async function updateProgression(id: string, progression: Partial<ChordProgressionData>) {
  const response = await fetch(`/api/progressions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progression)
  })
  return response.json()
}

export async function deleteProgression(id: string) {
  const response = await fetch(`/api/progressions/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}

export async function getProgression(id: string) {
  const response = await fetch(`/api/progressions/${id}`)
  return response.json()
}

export async function getAllProgressions() {
  const response = await fetch('/api/progressions')
  return response.json()
} 