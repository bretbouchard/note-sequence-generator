'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { debounce } from 'lodash'
import type { NoteSequence } from '@/types/music'
import ChordTemplates from '@/data/ChordTemplates'

interface ChordBoundary {
  id: string
  position: number
  duration: number
}

interface Props {
  sequence: NoteSequence
  showChords?: boolean
  showNotes?: boolean
  chordProgression?: Array<{
    degree: string
    scale_degree: string
    chord_notes_degree: string[]
    id: string
    template?: string
  }>
  onDurationsChange?: (durations: number[]) => void
}

// Change to default export
export default function SequenceDisplay({
  sequence,
  showChords = true,
  showNotes = true,
  chordProgression,
  onDurationsChange
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const frameRef = useRef<number>()
  const mountedRef = useRef(false)
  const [isViewCentered, setIsViewCentered] = useState(true)
  const [boundaries, setBoundaries] = useState<ChordBoundary[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Create debounced duration change handler
  const debouncedDurationChange = useCallback(
    debounce((newDurations: number[]) => {
      if (onDurationsChange && !isDragging) {  // Only trigger when not dragging
        onDurationsChange(newDurations)
      }
    }, 1000),
    [onDurationsChange, isDragging]
  )

  // Update boundaries when dragging ends
  const handleDragEnd = (index: number, newPosition: number) => {
    setIsDragging(false)
    setBoundaries(prev => {
      const newBoundaries = [...prev]
      const prevBoundary = newBoundaries[index - 1]
      const currentBoundary = newBoundaries[index]
      const nextBoundary = newBoundaries[index + 1]

      if (prevBoundary) {
        prevBoundary.duration = newPosition - prevBoundary.position
      }
      if (currentBoundary) {
        currentBoundary.position = newPosition
        if (nextBoundary) {
          currentBoundary.duration = nextBoundary.position - newPosition
        }
      }

      // Only trigger duration change when dragging ends
      const newDurations = newBoundaries.map(b => b.duration)
      debouncedDurationChange(newDurations)

      return newBoundaries
    })
  }

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || mountedRef.current) return

    console.log('Initializing Three.js scene')

    // Clear any existing canvas elements
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color('#111827')

    // Create camera with centered view
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera
    camera.position.set(0, 5, 25)  // Adjusted for better initial view
    camera.lookAt(0, 0, 0)

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 1.0)
    pointLight.position.set(-5, 5, 5)
    scene.add(pointLight)

    // Add controls with change handler
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableRotate = true
    controls.enablePan = true
    controls.enableZoom = true
    controls.addEventListener('change', () => {
      setIsViewCentered(false)
    })
    controlsRef.current = controls

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    mountedRef.current = true

    // Cleanup
    return () => {
      console.log('Cleaning up Three.js scene')
      mountedRef.current = false
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (sceneRef.current) {
        sceneRef.current.clear()
      }
      window.removeEventListener('resize', handleResize)

      // Remove canvas element
      if (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
  }, []) // Empty dependency array - only run once

  // Initialize boundaries
  useEffect(() => {
    if (!chordProgression) return
    
    let currentPosition = 0
    const newBoundaries = chordProgression.map(chord => {
      const boundary = {
        id: chord.id,
        position: currentPosition,
        duration: 4 // Default duration
      }
      currentPosition += boundary.duration
      return boundary
    })
    
    setBoundaries(newBoundaries)
  }, [chordProgression])

  // Helper to get template pattern for a chord
  const getChordPattern = (chordId: string) => {
    // Default to whole note template if none specified
    const defaultTemplate = ChordTemplates.basic[0]
    
    const chord = chordProgression?.find(c => c.id === chordId)
    if (!chord?.template) return defaultTemplate.pattern

    // Find specified template
    for (const category of Object.values(ChordTemplates)) {
      const template = category.find(t => t.id === chord.template)
      if (template) return template.pattern
    }

    return defaultTemplate.pattern
  }

  // Update visualization when sequence or visibility changes
  useEffect(() => {
    if (!sceneRef.current || !sequence) {
      console.log('Missing scene or sequence:', { scene: !!sceneRef.current, sequence })
      return
    }

    console.log('Updating visualization with sequence:', sequence)

    // Clear existing meshes
    const existingMeshes = sceneRef.current.children.filter(
      child => child instanceof THREE.Mesh
    )
    existingMeshes.forEach(mesh => {
      sceneRef.current?.remove(mesh)
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose()
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose()
        }
      }
    })

    // Add chord visualization if enabled
    if (showChords && chordProgression) {
      let chordStartTime = 0
      const totalDuration = sequence.durations.reduce((sum, d) => sum + d, 0)

      chordProgression.forEach((chord) => {
        const pattern = getChordPattern(chord.id)
        
        // Create meshes for each note in the pattern
        pattern.notePattern.forEach((note, noteIndex) => {
          note.degrees.forEach((relativeDegree) => {
            // Convert relative degree to actual scale degree
            const baseDegree = parseInt(chord.scale_degree.replace(/[^\d]/g, '')) || 1
            const actualDegree = ((baseDegree + relativeDegree - 1) % 7) || 7

            const chordGeometry = new THREE.BoxGeometry(
              note.durations[0] * (40 / totalDuration),
              0.8,
              0.2
            )
            
            const chordMaterial = new THREE.MeshPhongMaterial({
              color: new THREE.Color(0x4a5568),
              transparent: true,
              opacity: 0.6,
              shininess: 0
            })
            
            const chordMesh = new THREE.Mesh(chordGeometry, chordMaterial)
            
            const x = (chordStartTime + note.durations.reduce((sum, d, i) => i < noteIndex ? sum + d : sum, 0)) 
              * (40 / totalDuration) - 20
            const y = (actualDegree - 4) * 1.2
            chordMesh.position.set(x, y, -0.5)
            
            sceneRef.current?.add(chordMesh)
          })
        })
        
        chordStartTime += pattern.duration
      })
    }

    // Create notes visualization if enabled
    if (showNotes) {
      let currentTime = 0
      const totalDuration = sequence.durations.reduce((sum, d) => sum + d, 0)

      sequence.scaleDegrees.forEach((degree, index) => {
        const duration = sequence.durations[index]
        
        const geometry = new THREE.BoxGeometry(
          duration * (40 / totalDuration),
          0.8,
          0.2  // Reduced thickness
        )
        
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(degree / 7, 0.8, 0.6),
          emissive: new THREE.Color().setHSL(degree / 7, 0.8, 0.3),
          shininess: 50,
          specular: new THREE.Color(0x444444)
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        
        const x = currentTime * (40 / totalDuration) - 20
        const y = (degree - 4) * 1.2
        mesh.position.set(x, y, 0)
        
        sceneRef.current?.add(mesh)
        
        currentTime += duration
      })
    }

    // Adjust camera
    if (cameraRef.current) {
      const zoom = 25
      cameraRef.current.position.z = zoom
      cameraRef.current.lookAt(0, 0, 0)
    }
  }, [sequence, showChords, showNotes, chordProgression])

  // Handle recenter
  const handleRecenter = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5, 25)
      cameraRef.current.lookAt(0, 0, 0)
      setIsViewCentered(true)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* View Controls */}
      {!isViewCentered && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleRecenter}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium"
          >
            Recenter
          </button>
        </div>
      )}

      {/* Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      />
    </div>
  )
} 