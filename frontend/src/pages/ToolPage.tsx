import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { Tool } from '../data/tools'
import FileDropzone from '../components/FileDropzone'
import Toast, { useToast } from '../components/Toast'
import MergeOptions from '../components/options/MergeOptions'
import SplitOptions from '../components/options/SplitOptions'
import CompressOptions from '../components/options/CompressOptions'
import WatermarkOptions from '../components/options/WatermarkOptions'
import PageNumberOptions from '../components/options/PageNumberOptions'
import RotateOptions from '../components/options/RotateOptions'
import GenericOptions from '../components/options/GenericOptions'

interface Props {
  tool: Tool
}

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' } as never,
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: 'easeIn' } as never,
  },
}

function OptionsPanel({
  tool,
  options,
  onChange,
}: {
  tool: Tool
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
}) {
  switch (tool.id) {
    case 'merge':
      return <MergeOptions options={options} onChange={onChange} color={tool.color} />
    case 'split':
      return <SplitOptions options={options} onChange={onChange} color={tool.color} />
    case 'compress':
      return <CompressOptions options={options} onChange={onChange} color={tool.color} />
    case 'watermark':
      return <WatermarkOptions options={options} onChange={onChange} color={tool.color} />
    case 'page-numbers':
      return <PageNumberOptions options={options} onChange={onChange} color={tool.color} />
    case 'rotate':
      return <RotateOptions options={options} onChange={onChange} color={tool.color} />
    default:
      return <GenericOptions tool={tool} options={options} onChange={onChange} />
  }
}

export default function ToolPage({ tool }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] = useState<Record<string, unknown>>({})
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const { toast, show: showToast, hide: hideToast } = useToast()

  const canProcess = files.length > 0 && !processing

  async function handleProcess() {
    if (!canProcess) return
    setProcessing(true)
    setDone(false)
    showToast('正在處理中...', 'loading')

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))
      formData.append('options', JSON.stringify(options))

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/api/${tool.id}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: '處理失敗' }))
        throw new Error(err.detail || '處理失敗')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setDone(true)
      hideToast()
      showToast('處理完成！', 'success')
    } catch (err: unknown) {
      hideToast()
      const msg = err instanceof Error ? err.message : '處理失敗，請重試'
      showToast(msg, 'error')
    } finally {
      setProcessing(false)
    }
  }

  function handleDownload() {
    if (!downloadUrl) return
    const ext =
      tool.id === 'pdf-to-jpg' || tool.id === 'split'
        ? '.zip'
        : tool.id.includes('word')
        ? '.docx'
        : tool.id.includes('ppt')
        ? '.pptx'
        : tool.id.includes('excel')
        ? '.xlsx'
        : '.pdf'
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `freepdf-${tool.id}${ext}`
    a.click()
  }

  function handleReset() {
    setFiles([])
    setOptions({})
    setDone(false)
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setDownloadUrl(null)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-6 pt-8 pb-24"
    >
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 mb-8 text-[13px]"
      >
        <Link
          to="/"
          className="text-apple-secondary hover:text-apple-blue transition-colors duration-200 no-underline"
        >
          所有工具
        </Link>
        <span className="text-apple-secondary/50">›</span>
        <span className="text-apple-text font-medium">{tool.name}</span>
      </motion.div>

      {/* Tool Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
        className="flex items-center gap-4 mb-10"
      >
        <motion.div
          className="w-14 h-14 rounded-[16px] flex items-center justify-center text-white text-2xl font-bold shadow-apple-md"
          style={{ background: `linear-gradient(135deg, ${tool.color}ee, ${tool.color}99)` }}
          whileHover={{ scale: 1.08, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {tool.icon}
        </motion.div>
        <div>
          <h1 className="text-[28px] font-bold text-apple-text tracking-tight mb-0.5">
            {tool.name}
          </h1>
          <p className="text-apple-secondary text-[15px]">{tool.description}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload + Options */}
        <div className="lg:col-span-2 space-y-5">
          {/* Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="bg-white rounded-apple p-6 shadow-apple-card"
          >
            <h2 className="text-[15px] font-semibold text-apple-text mb-4">上傳檔案</h2>
            <FileDropzone
              accept={tool.accept}
              multiple={tool.multiple}
              files={files}
              onFilesChange={setFiles}
              color={tool.color}
            />
          </motion.div>

          {/* Options */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="bg-white rounded-apple p-6 shadow-apple-card"
          >
            <h2 className="text-[15px] font-semibold text-apple-text mb-4">設定選項</h2>
            <OptionsPanel tool={tool} options={options} onChange={setOptions} />
          </motion.div>
        </div>

        {/* Right: Action Panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-apple p-5 shadow-apple-card sticky top-20">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] text-apple-secondary">
                  {files.length > 0 ? `已選擇 ${files.length} 個檔案` : '尚未選擇檔案'}
                </span>
                {files.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-[12px] text-apple-secondary hover:text-apple-red transition-colors"
                  >
                    清除
                  </button>
                )}
              </div>
              {files.length > 0 && (
                <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: tool.color }}
                    initial={{ width: 0 }}
                    animate={{ width: processing ? '70%' : done ? '100%' : '30%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>

            <motion.button
              onClick={handleProcess}
              disabled={!canProcess}
              className="w-full py-3 rounded-apple-sm font-semibold text-[15px] text-white transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${tool.color}ee, ${tool.color}bb)`,
              }}
              whileHover={canProcess ? { scale: 1.02 } : {}}
              whileTap={canProcess ? { scale: 0.97 } : {}}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  處理中...
                </span>
              ) : (
                `開始${tool.name}`
              )}
            </motion.button>

            {done && downloadUrl && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={handleDownload}
                className="w-full mt-3 py-3 rounded-apple-sm font-semibold text-[15px] border-2 transition-all duration-200"
                style={{ borderColor: tool.color, color: tool.color }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                ⬇ 下載{tool.outputLabel}
              </motion.button>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-apple p-5 shadow-apple-card">
            <h3 className="text-[13px] font-semibold text-apple-text mb-3">關於此工具</h3>
            <div className="space-y-2.5">
              {[
                { icon: '🔒', text: '安全傳輸，處理後即刪除' },
                { icon: '⚡', text: '極速處理引擎' },
                { icon: '🆓', text: '完全免費使用' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <span className="text-[14px]">{item.icon}</span>
                  <span className="text-apple-secondary text-[12px]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Toast {...toast} />
    </motion.div>
  )
}
