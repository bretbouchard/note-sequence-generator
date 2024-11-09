import React, { useRef, useEffect } from 'react';
import { NoteSequence } from 'tone';
import cn from 'classnames';

interface NoteSequenceCanvasProps {
  sequence: NoteSequence;
  className?: string;
  onRender?: () => void;
}

const NoteSequenceCanvas: React.FC<NoteSequenceCanvasProps> = ({ 
  sequence, 
  className,
  onRender 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('Canvas received sequence:', sequence)
    const canvas = canvasRef.current;
    if (!canvas || !sequence) {
      console.warn('Missing canvas or sequence')
      return;
    }

    // Get the actual dimensions
    const rect = canvas.getBoundingClientRect();
    console.log('Canvas dimensions:', rect)

    // Setup canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context')
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sequence
    // ... your drawing code ...

    onRender?.();
  }, [sequence, onRender]);

  return (
    <canvas 
      ref={canvasRef}
      className={cn(
        "border border-gray-200", // Add visible border for debugging
        className
      )}
      style={{ background: '#fff' }} // Add background for visibility
    />
  );
};

export default NoteSequenceCanvas; 