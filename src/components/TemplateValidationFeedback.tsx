'use client'

interface Props {
  errors: string[]
  warnings: string[]
  onClose?: () => void
}

export default function TemplateValidationFeedback({ errors, warnings, onClose }: Props) {
  if (errors.length === 0 && warnings.length === 0) return null

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-md">
      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-400">
            Errors ({errors.length})
          </h4>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-300 flex items-start gap-2">
                <span className="text-red-400">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yellow-400">
            Warnings ({warnings.length})
          </h4>
          <ul className="space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-300 flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="mt-2 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
        >
          Dismiss
        </button>
      )}
    </div>
  )
} 