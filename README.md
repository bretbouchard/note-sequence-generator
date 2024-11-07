# Note Sequence Generator

A visual tool for creating and manipulating musical note sequences based on scale degrees and chord progressions. This project is designed to be a module in a larger music composition system.

## Overview

The Note Sequence Generator is a specialized tool that works with scale degrees (1-7) rather than absolute notes (C, D, E, etc.). This approach makes it easier to:
- Work with patterns that can be transposed to any key
- Visualize relationships between notes and chord progressions
- Create reusable melodic and rhythmic templates

**Note:** This tool is focused on pattern visualization and generation - it does not produce audio output.

## Features

- Visual piano-roll style interface
- Chord progression selection and visualization
- Template-based sequence generation
  - Note templates with scale degrees
  - Rhythm templates with customizable durations and rests
  - Pattern direction controls (forward, backward, ping-pong)
  - Pattern behavior options (continuous, restart per chord)
  - Chord tone mode for arpeggiated patterns

## Technical Stack

- **Frontend Framework:** Next.js 15
- **Styling:** TailwindCSS
- **Language:** TypeScript
- **State Management:** React Hooks
- **Build Tools:** npm

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # React components
│   ├── PianoRollView.tsx
│   ├── TemplateEditor.tsx
│   └── ...
├── lib/             # Core logic
│   └── sequenceGeneratorServer.ts
└── types/           # TypeScript definitions
    └── music.ts
```

## Future Integration

This tool is designed to be a module in a larger music composition system. It will integrate with:
- Audio playback modules
- DAW integration
- Music notation systems
- Pattern libraries

## Contributing

This project is part of a larger music composition toolkit. If you're interested in contributing, please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

[Your chosen license]

## Related Projects

[Links to related projects or the main project this will be part of]
