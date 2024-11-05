'use client'

import { useState } from 'react'

interface VisualizationControlsProps {
  onRotationSpeedChange: (speed: number) => void
  onColorSchemeChange: (scheme: string) => void
  onViewModeChange: (mode: '3d' | '2d') => void
}

export default function VisualizationControls({
  onRotationSpeedChange,
  onColorSchemeChange,
  onViewModeChange
}: VisualizationControlsProps) {
  const [rotationSpeed, setRotationSpeed] = useState(1)
  const [colorScheme, setColorScheme] = useState('default')
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value)
    setRotationSpeed(speed)
    onRotationSpeedChange(speed)
  }

  const handleColorSchemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColorScheme(e.target.value)
    onColorSchemeChange(e.target.value)
  }

  const handleViewModeChange = (mode: '3d' | '2d') => {
    setViewMode(mode)
    onViewModeChange(mode)
  }

  return (
    <div className="absolute bottom-4 left-4 p-4 bg-black/50 rounded-lg backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="rotation-speed" 
            className="text-sm text-white"
          >
            Rotation Speed
          </label>
          <input
            id="rotation-speed"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={rotationSpeed}
            onChange={handleRotationChange}
            className="w-48"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="color-scheme" 
            className="text-sm text-white"
          >
            Color Scheme
          </label>
          <select
            id="color-scheme"
            value={colorScheme}
            onChange={handleColorSchemeChange}
            className="w-48 bg-black/50 text-white rounded px-2 py-1"
          >
            <option value="default">Default</option>
            <option value="rainbow">Rainbow</option>
            <option value="monochrome">Monochrome</option>
            <option value="complementary">Complementary</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleViewModeChange('3d')}
            className={`px-4 py-2 rounded ${
              viewMode === '3d' 
                ? 'bg-white text-black' 
                : 'bg-black/50 text-white'
            }`}
          >
            3D
          </button>
          <button
            onClick={() => handleViewModeChange('2d')}
            className={`px-4 py-2 rounded ${
              viewMode === '2d' 
                ? 'bg-white text-black' 
                : 'bg-black/50 text-white'
            }`}
          >
            2D
          </button>
        </div>
      </div>
    </div>
  )
} 