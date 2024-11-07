'use client'

import type { NoteTemplate, RhythmTemplate } from '@/types/music'

interface TemplateVersion {
  version: number
  timestamp: string
  data: NoteTemplate | RhythmTemplate
  changes: string[]
}

interface VersionedTemplate {
  id: string
  type: 'note' | 'rhythm'
  currentVersion: number
  versions: TemplateVersion[]
}

export function createVersionedTemplate(
  template: NoteTemplate | RhythmTemplate,
  type: 'note' | 'rhythm'
): VersionedTemplate {
  return {
    id: template.id,
    type,
    currentVersion: 1,
    versions: [{
      version: 1,
      timestamp: new Date().toISOString(),
      data: template,
      changes: ['Initial version']
    }]
  }
}

export function addTemplateVersion(
  versionedTemplate: VersionedTemplate,
  newData: NoteTemplate | RhythmTemplate,
  changes: string[]
): VersionedTemplate {
  const newVersion = versionedTemplate.currentVersion + 1
  
  return {
    ...versionedTemplate,
    currentVersion: newVersion,
    versions: [
      ...versionedTemplate.versions,
      {
        version: newVersion,
        timestamp: new Date().toISOString(),
        data: newData,
        changes
      }
    ]
  }
}

export function revertToVersion(
  versionedTemplate: VersionedTemplate,
  version: number
): VersionedTemplate | null {
  const targetVersion = versionedTemplate.versions.find(v => v.version === version)
  if (!targetVersion) return null

  return {
    ...versionedTemplate,
    currentVersion: version,
    versions: versionedTemplate.versions.filter(v => v.version <= version)
  }
}

export function compareVersions(
  oldVersion: NoteTemplate | RhythmTemplate,
  newVersion: NoteTemplate | RhythmTemplate
): string[] {
  const changes: string[] = []

  // Compare repetition changes
  if (oldVersion.repetition.startBar !== newVersion.repetition.startBar) {
    changes.push(`Changed start bar from ${oldVersion.repetition.startBar} to ${newVersion.repetition.startBar}`)
  }
  if (oldVersion.repetition.duration !== newVersion.repetition.duration) {
    changes.push(`Changed duration from ${oldVersion.repetition.duration} to ${newVersion.repetition.duration}`)
  }

  // Compare note-specific changes
  if ('scaleDegrees' in oldVersion && 'scaleDegrees' in newVersion) {
    if (JSON.stringify(oldVersion.scaleDegrees) !== JSON.stringify(newVersion.scaleDegrees)) {
      changes.push('Modified scale degrees')
    }
    if (JSON.stringify(oldVersion.weights) !== JSON.stringify(newVersion.weights)) {
      changes.push('Modified note weights')
    }
  }

  // Compare rhythm-specific changes
  if ('durations' in oldVersion && 'durations' in newVersion) {
    if (JSON.stringify(oldVersion.durations) !== JSON.stringify(newVersion.durations)) {
      changes.push('Modified rhythm durations')
    }
    if (oldVersion.templateDuration !== newVersion.templateDuration) {
      changes.push(`Changed template duration from ${oldVersion.templateDuration} to ${newVersion.templateDuration}`)
    }
  }

  return changes
} 