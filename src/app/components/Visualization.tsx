'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface VisualizationProps {
  sequence: {
    scaleDegrees: number[]
    durations: number[]
  } | null
}

export default function Visualization({ sequence }: VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !sequence) return

    // Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)

    // Position camera
    camera.position.z = 15

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [sequence])

  return <div ref={containerRef} className="w-full h-screen" />
} 