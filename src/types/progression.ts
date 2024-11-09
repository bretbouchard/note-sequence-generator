export interface Chord {
  root: string;
  quality: string;
  duration: number;
  // Add any other required properties
}

export interface ChordProgression {
  id: string;
  name?: string;
  chords: Chord[];
  // Add any other required properties
} 