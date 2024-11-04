'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface Props {
  position: THREE.Vector3
  onDrag: (position: THREE.Vector3) => void
  onDragStart: () => void
  onDragEnd: () => void
  children: THREE.Object3D
}

export function Draggable({ position, onDrag, onDragStart, onDragEnd, children }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const dragStartPosition = useRef<THREE.Vector3>(new THREE.Vector3())
  const isDragging = useRef(false)

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault()
      isDragging.current = true
      dragStartPosition.current.copy(position)
      onDragStart()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current) return

      const newPosition = new THREE.Vector3(
        position.x + event.movementX * 0.01,
        position.y,
        position.z
      )

      onDrag(newPosition)
    }

    const handlePointerUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      onDragEnd()
    }

    mesh.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      mesh.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [position, onDrag, onDragStart, onDragEnd])

  return <primitive object={children} ref={meshRef} />
} 