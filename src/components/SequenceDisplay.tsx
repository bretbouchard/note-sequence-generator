'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { NoteSequence } from '@/types/music'
import PianoRollView from './PianoRollView'

interface Props {
  sequence: NoteSequence | null
  showChords: boolean
  showNotes: boolean
  template?: any
}

export default function SequenceDisplay({ sequence, showChords, showNotes, template }: Props) {
  const [viewMode, setViewMode] = useState<'3d' | 'piano-roll'>('3d')
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || viewMode !== '3d') return

    console.log('Initializing Three.js scene')

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth - 320) / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 15)

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth - 320, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Store refs
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = (window.innerWidth - 320) / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth - 320, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      console.log('Cleaning up Three.js scene')
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      scene.clear()
      sceneRef.current = null
      rendererRef.current = null
      cameraRef.current = null
      controlsRef.current = null
    }
  }, [viewMode]) // Add viewMode to dependencies

  // Update visualization when sequence changes
  useEffect(() => {
    if (viewMode !== '3d' || !sequence || !sceneRef.current || !rendererRef.current || !cameraRef.current) return

    console.log('Updating visualization:', { 
      sequence, 
      showChords, 
      showNotes,
      hasChordProgression: sequence?.chordProgression ? 'yes' : 'no'
    })

    const scene = sceneRef.current
    const camera = cameraRef.current
    const renderer = rendererRef.current

    // Clear existing visualization
    while(scene.children.length > 0) { 
      const obj = scene.children[0]
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose()
        }
      }
      scene.remove(obj)
    }

    // Re-add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)

    // Add visualization elements
    const noteGeometries: THREE.Mesh[] = []
    const chordGeometries: THREE.Mesh[] = []

    if (showChords && sequence.chordProgression) {
      console.log('Adding chord visualization:', sequence.chordProgression)
      sequence.chordProgression.degrees.forEach((degree, index) => {
        const geometry = new THREE.BoxGeometry(2, 0.5, 2)
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(degree / 7, 0.6, 0.4),
          transparent: true,
          opacity: 0.6
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        const spacing = 3
        mesh.position.set(index * spacing - (sequence.chordProgression!.degrees.length * spacing / 2), -2, 0)
        
        scene.add(mesh)
        chordGeometries.push(mesh)
      })
    }

    if (showNotes) {
      console.log('Adding note visualization:', sequence.scaleDegrees)
      sequence.scaleDegrees.forEach((degree, index) => {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32)
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(degree / 7, 0.7, 0.5)
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        const angle = (index / sequence.scaleDegrees.length) * Math.PI * 2
        const radius = 5
        mesh.position.set(
          Math.cos(angle) * radius,
          degree - 4,
          Math.sin(angle) * radius
        )
        
        scene.add(mesh)
        noteGeometries.push(mesh)
      })
    }

    // Animation loop for the objects
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      
      chordGeometries.forEach((mesh) => {
        mesh.rotation.y += 0.005
      })

      noteGeometries.forEach((mesh, index) => {
        const duration = sequence.durations[index]
        mesh.rotation.y += 0.01 * duration
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }

  }, [sequence, showChords, showNotes, viewMode])

  return (
    <div className="relative w-full h-screen">
      {/* View Toggle Button */}
      <button
        onClick={() => setViewMode(prev => prev === '3d' ? 'piano-roll' : '3d')}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-md 
                 hover:bg-gray-700 transition-colors z-10"
      >
        {viewMode === '3d' ? 'Switch to Piano Roll' : 'Switch to 3D View'}
      </button>

      {viewMode === '3d' ? (
        <div 
          ref={containerRef} 
          className="w-full h-screen bg-gradient-to-b from-gray-900 to-black"
          aria-label="Music sequence visualization"
        />
      ) : (
        <PianoRollView
          sequence={sequence}
          showChords={showChords}
          showNotes={showNotes}
        />
      )}
    </div>
  )
}