import { getActiveTemplates } from '@/data/ChordTemplates'
import { getProgression } from '@/data/Progression'

// ... existing code ...

const handleTemplatesLoaded = async () => {
  const activeTemplates = getActiveTemplates()
  const progression = await getProgression()
  
  if (activeTemplates.length > 0 && progression) {
    console.log('Templates and progression loaded, generating sequences...')
    generateSequences(activeTemplates, progression)
  } else {
    console.warn('Missing templates or progression, cannot generate sequences')
  }
}

// Add this to your component's useEffect or initialization logic
useEffect(() => {
  handleTemplatesLoaded()
}, []) // If progression is passed as a prop, add it to dependencies

const generateSequences = (templates: ChordTemplate[], progression: Progression) => {
  // Your sequence generation logic here
}