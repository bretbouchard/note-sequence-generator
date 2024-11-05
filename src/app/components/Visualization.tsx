'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface VisualizationProps {
  sequence: {
    scaleDegrees: number[]
    durations: number[]
  } | null
}

export default function Visualization({ sequence }: VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !sequence) return

    // Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
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
    controls.dampingFactor = 0.05

    // Create visualization
    try {
      const noteGeometries: THREE.Mesh[] = []
      
      sequence.scaleDegrees.forEach((degree, index) => {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32)
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(degree / 7, 0.7, 0.5)
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        
        // Position notes in a spiral
        const angle = (index / sequence.scaleDegrees.length) * Math.PI * 2
        const radius = 5
        mesh.position.set(
          Math.cos(angle) * radius,
          degree - 4, // Y position based on scale degree
          Math.sin(angle) * radius
        )
        
        scene.add(mesh)
        noteGeometries.push(mesh)
      })

      // Position camera
      camera.position.set(0, 5, 15)
      camera.lookAt(0, 0, 0)

      // Animation loop
      let frame: number
      const animate = () => {
        frame = requestAnimationFrame(animate)
        
        // Rotate notes slightly
        noteGeometries.forEach((mesh, index) => {
          const time = Date.now() * 0.001
          const duration = sequence.durations[index]
          mesh.rotation.y += 0.01 * duration
        })

        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', handleResize)

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(frame)
        
        // Dispose geometries and materials
        noteGeometries.forEach(mesh => {
          mesh.geometry.dispose()
          ;(mesh.material as THREE.Material).dispose()
          scene.remove(mesh)
        })
        
        renderer.dispose()
        containerRef.current?.removeChild(renderer.domElement)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred in visualization')
      console.error('Visualization error:', err)
    }
  }, [sequence])

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen bg-gradient-to-b from-gray-900 to-black"
      aria-label="Music sequence visualization"
    />
  )
} 