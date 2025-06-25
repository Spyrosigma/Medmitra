"use client"

import { useState, useRef, DragEvent } from "react"

interface DragDropAreaProps {
  onFilesDrop: (files: File[]) => void
  acceptedTypes?: string[]
  maxFileSize?: number // in MB
  className?: string
}

export const DragDropArea = ({ 
  onFilesDrop, 
  acceptedTypes = ['.pdf', '.docx', '.txt'],
  maxFileSize = 10,
  className = ""
}: DragDropAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size must be less than ${maxFileSize}MB`)
      return false
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Only ${acceptedTypes.join(', ')} files are supported`)
      return false
    }

    return true
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
    setError(null)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only set drag over to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(validateFile)

    if (validFiles.length > 0) {
      onFilesDrop(validFiles)
      setError(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(validateFile)

    if (validFiles.length > 0) {
      onFilesDrop(validFiles)
      setError(null)
    }

    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-2
          transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
            : 'border-gray-300 bg-white/50 hover:border-gray-400 hover:bg-white/70'
          }
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Drop zone content */}
        <div className="text-center">
          {/* Upload icon */}
          <div className={`mx-auto mb-1 transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
            <svg
              className={`w-6 h-6 mx-auto ${
                isDragOver ? 'text-blue-500' : error ? 'text-red-400' : 'text-blue-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Text content */}
          <div className="space-y-0.5">
            <h3 className={`text-xs font-medium ${
              isDragOver ? 'text-blue-600' : error ? 'text-red-600' : 'text-gray-700'
            }`}>
              {isDragOver ? 'Drop files here' : 'Upload documents'}
            </h3>
            
            <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
              {error || 'Drag & drop or click to browse'}
            </p>
            <p className="text-xs text-gray-400">
              Supports {acceptedTypes.join(', ')} files up to {maxFileSize}MB
            </p>
          </div>
        </div>

        {/* Animated border effect when dragging */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse" />
        )}
      </div>
    </div>
  )
} 