import { motion } from 'framer-motion'

interface Props {
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
  color: string
}

const ANGLES = [
  { value: 90, label: '順時針 90°', icon: '↻' },
  { value: 180, label: '旋轉 180°', icon: '↕' },
  { value: 270, label: '逆時針 90°', icon: '↺' },
]

export default function RotateOptions({ options, onChange, color }: Props) {
  const angle = (options.angle as number) || 90

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-3">
          旋轉角度
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ANGLES.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => onChange({ ...options, angle: opt.value })}
              className="py-4 rounded-apple-sm border flex flex-col items-center gap-1.5 transition-all"
              style={{
                borderColor: angle === opt.value ? color : 'rgba(0,0,0,0.12)',
                backgroundColor: angle === opt.value ? `${color}08` : 'white',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="text-2xl"
                animate={{ rotate: angle === opt.value ? opt.value : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {opt.icon}
              </motion.span>
              <span
                className="text-[11px] font-medium"
                style={{ color: angle === opt.value ? color : '#86868B' }}
              >
                {opt.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-2">
          套用至頁面
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'all', label: '全部頁面' },
            { value: 'specific', label: '指定頁面' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...options, pages: opt.value })}
              className="py-2.5 px-4 rounded-apple-sm text-[13px] font-medium border transition-all"
              style={{
                borderColor: options.pages === opt.value ? color : 'rgba(0,0,0,0.1)',
                backgroundColor: options.pages === opt.value ? `${color}10` : 'white',
                color: options.pages === opt.value ? color : '#86868B',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {options.pages === 'specific' && (
        <div>
          <label className="text-[13px] font-medium text-apple-text block mb-1.5">
            頁面範圍
          </label>
          <input
            type="text"
            placeholder="例如：1, 3-5, 8"
            value={(options.pageRange as string) || ''}
            onChange={(e) => onChange({ ...options, pageRange: e.target.value })}
            className="w-full px-3 py-2.5 rounded-apple-sm border border-apple-border text-[13px] outline-none focus:border-apple-blue transition-colors"
          />
        </div>
      )}
    </div>
  )
}
