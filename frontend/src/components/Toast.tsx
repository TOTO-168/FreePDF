import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export type ToastType = 'success' | 'error' | 'loading'

interface ToastProps {
  message: string
  type: ToastType
  visible: boolean
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  loading: '⋯',
}

const colors: Record<ToastType, string> = {
  success: '#34C759',
  error: '#FF3B30',
  loading: '#0071E3',
}

export default function Toast({ message, type, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-apple-xl"
          style={{
            background: 'rgba(28, 28, 30, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <motion.div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ backgroundColor: colors[type] }}
            animate={type === 'loading' ? { rotate: 360 } : {}}
            transition={type === 'loading' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          >
            {icons[type]}
          </motion.div>
          <span className="text-white text-[14px] font-medium whitespace-nowrap">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for easy toast management
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  })

  const show = (message: string, type: ToastType = 'success', duration = 3000) => {
    setToast({ message, type, visible: true })
    if (type !== 'loading') {
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), duration)
    }
  }

  const hide = () => setToast((t) => ({ ...t, visible: false }))

  return { toast, show, hide }
}
