'use client'

export default function TemplateLoadingIndicator() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
          <span className="text-white">Loading templates...</span>
        </div>
      </div>
    </div>
  )
} 