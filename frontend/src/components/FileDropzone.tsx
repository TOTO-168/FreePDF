import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  accept: string[]
  multiple?: boolean
  files: File[]
  onFilesChange: (files: File[]) => void
  color: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileDropzone({ accept, multiple = false, files, onFilesChange, color }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        onFilesChange([...files, ...acceptedFiles])
      } else {
        onFilesChange(acceptedFiles.slice(0, 1))
      }
      setIsDragging(false)
    },
    [files, multiple, onFilesChange]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, ext) => {
      const mimeMap: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.tiff': 'image/tiff',
        '.bmp': 'image/bmp',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.html': 'text/html',
        '.htm': 'text/html',
      }
      const mime = mimeMap[ext] || '*/*'
      if (!acc[mime]) acc[mime] = []
      acc[mime].push(ext)
      return acc
    }, {} as Record<string, string[]>),
    multiple,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <motion.div
        {...(getRootProps() as object)}
        animate={{
          borderColor: isDragging ? color : 'rgba(0,0,0,0.12)',
          backgroundColor: isDragging ? `${color}08` : 'rgba(255,255,255,0.8)',
          scale: isDragging ? 1.01 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative rounded-apple-lg border-2 border-dashed p-12 text-center cursor-pointer transition-colors"
        style={{ minHeight: 200 }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${color}15` }}
              >
                ⬇️
              </div>
              <p className="text-apple-text font-semibold text-lg">放開以上傳</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-16 h-16 rounded-[18px] mx-auto mb-4 flex items-center justify-center text-3xl shadow-apple-sm"
                style={{ backgroundColor: `${color}15` }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                📁
              </motion.div>
              <p className="text-apple-text font-semibold text-[17px] mb-1.5">
                拖放檔案至此，或{' '}
                <span style={{ color }} className="cursor-pointer hover:underline">
                  點擊選擇
                </span>
              </p>
              <p className="text-apple-secondary text-[13px]">
                支援：{accept.join('、')}
                {multiple && ' · 可多選'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, height: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="flex items-center gap-3 bg-white rounded-apple-sm px-4 py-3 shadow-apple-sm"
              >
                {/* File Icon */}
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {file.name.split('.').pop()?.toUpperCase().slice(0, 3) || 'FILE'}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-apple-text text-[13px] font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-apple-secondary text-[12px]">
                    {formatBytes(file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-apple-secondary hover:text-apple-red hover:bg-red-50 transition-all duration-200 flex-shrink-0 text-[14px]"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
