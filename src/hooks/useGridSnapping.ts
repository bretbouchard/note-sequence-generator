'use client'

import { useCallback } from 'react'

interface GridSettings {
  gridSize: number  // Base grid size in pixels
  snapThreshold: number  // Distance in pixels to trigger snap
  quantizeValue: 1 | 2 | 4 | 8 | 16  // Note divisions (1 = whole note, 4 = quarter note, etc.)
}

export function useGridSnapping(settings: GridSettings) {
  // Snap position to grid
  const snapToGrid = useCallback((x: number, y: number) => {
    const { gridSize, snapThreshold } = settings
    
    const snapX = Math.round(x / gridSize) * gridSize
    const snapY = Math.round(y / gridSize) * gridSize
    
    // Only snap if within threshold
    return {
      x: Math.abs(x - snapX) < snapThreshold ? snapX : x,
      y: Math.abs(y - snapY) < snapThreshold ? snapY : y
    }
  }, [settings])

  // Quantize duration to nearest grid division
  const quantizeDuration = useCallback((duration: number) => {
    const { quantizeValue } = settings
    const gridDuration = 4 / quantizeValue // Convert to quarter notes
    return Math.round(duration / gridDuration) * gridDuration
  }, [settings])

  // Convert grid position to musical time
  const gridToTime = useCallback((gridX: number) => {
    const { gridSize, quantizeValue } = settings
    const beat = (gridX / gridSize) * (4 / quantizeValue)
    return {
      bar: Math.floor(beat / 4),
      beat: beat % 4,
      division: Math.round((beat % 1) * quantizeValue)
    }
  }, [settings])

  return {
    snapToGrid,
    quantizeDuration,
    gridToTime
  }
} 