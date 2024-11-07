import type { NoteTemplate, RhythmTemplate } from '@/types/music'

// Template Categories
export type TemplateCategory = 'basic' | 'jazz' | 'latin' | 'custom'

interface StoredTemplate {
  id: string
  name: string
  category: TemplateCategory
  createdAt: string
  template: NoteTemplate | RhythmTemplate
  type: 'note' | 'rhythm'
}

class TemplateService {
  private readonly STORAGE_KEY = 'music_templates'

  // Load all templates from storage
  async loadTemplates(): Promise<StoredTemplate[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Save template to storage
  async saveTemplate(
    template: NoteTemplate | RhythmTemplate,
    type: 'note' | 'rhythm',
    name: string,
    category: TemplateCategory = 'custom'
  ): Promise<StoredTemplate> {
    const templates = await this.loadTemplates()
    
    const storedTemplate: StoredTemplate = {
      id: `${type}-${Date.now()}`,
      name,
      category,
      createdAt: new Date().toISOString(),
      template,
      type
    }
    
    templates.push(storedTemplate)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates))
    
    return storedTemplate
  }

  // Delete template from storage
  async deleteTemplate(id: string): Promise<void> {
    const templates = await this.loadTemplates()
    const filtered = templates.filter(t => t.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }

  // Load templates by category
  async loadTemplatesByCategory(
    category: TemplateCategory,
    type: 'note' | 'rhythm'
  ): Promise<StoredTemplate[]> {
    const templates = await this.loadTemplates()
    return templates.filter(t => t.category === category && t.type === type)
  }

  // Update existing template
  async updateTemplate(
    id: string,
    updates: Partial<StoredTemplate>
  ): Promise<StoredTemplate | null> {
    const templates = await this.loadTemplates()
    const index = templates.findIndex(t => t.id === id)
    
    if (index === -1) return null
    
    templates[index] = { ...templates[index], ...updates }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates))
    
    return templates[index]
  }

  // Get default templates
  getDefaultTemplates(type: 'note' | 'rhythm'): StoredTemplate[] {
    if (type === 'note') {
      return [
        {
          id: 'default-note-1',
          name: 'Basic Scale',
          category: 'basic',
          createdAt: new Date().toISOString(),
          type: 'note',
          template: {
            id: 'default-note-1',
            scaleDegrees: [1, 2, 3, 4, 5],
            weights: [1, 1, 1, 1, 1],
            repetition: { startBar: 0, duration: 1 }
          }
        },
        // Add more default note templates...
      ]
    } else {
      return [
        {
          id: 'default-rhythm-1',
          name: 'Quarter Notes',
          category: 'basic',
          createdAt: new Date().toISOString(),
          type: 'rhythm',
          template: {
            id: 'default-rhythm-1',
            durations: [1, 1, 1, 1],
            templateDuration: 1,
            repetition: { startBar: 0, duration: 1 }
          }
        },
        // Add more default rhythm templates...
      ]
    }
  }
}

export const templateService = new TemplateService() 