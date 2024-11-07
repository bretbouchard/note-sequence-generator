'use client'

import { useState } from 'react'
import type { NoteTemplate, RhythmTemplate } from '@/types/music'
import { VersionedTemplate, compareVersions } from '@/lib/templateVersioning'

interface Props {
  versionedTemplate: VersionedTemplate
  onRevert: (version: number) => void
  onClose: () => void
}

export default function TemplateVersionHistory({ versionedTemplate, onRevert, onClose }: Props) {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-white">Version History</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="space-y-2">
        {versionedTemplate.versions.map((version, index) => {
          const isLatest = version.version === versionedTemplate.currentVersion
          const isSelected = version.version === selectedVersion

          // Get changes from previous version
          const previousVersion = versionedTemplate.versions[index - 1]?.data
          const changes = previousVersion 
            ? compareVersions(previousVersion, version.data)
            : version.changes

          return (
            <div
              key={version.version}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-blue-900/50'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedVersion(version.version)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">
                      Version {version.version}
                    </span>
                    {isLatest && (
                      <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(version.timestamp).toLocaleString()}
                  </div>
                </div>
                {!isLatest && selectedVersion === version.version && (
                  <button
                    onClick={() => onRevert(version.version)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Revert to this version
                  </button>
                )}
              </div>
              {changes.length > 0 && (
                <div className="mt-2 space-y-1">
                  {changes.map((change, i) => (
                    <div key={i} className="text-xs text-gray-300">
                      • {change}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 