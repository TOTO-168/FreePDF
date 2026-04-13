interface Props {
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
  color: string
}

const LEVELS = [
  { value: 'low', label: '低壓縮', desc: '檔案較大，品質最佳', icon: '⭐⭐⭐' },
  { value: 'medium', label: '中等壓縮', desc: '平衡品質與大小', icon: '⭐⭐' },
  { value: 'high', label: '高壓縮', desc: '檔案最小，品質稍降', icon: '⭐' },
]

export default function CompressOptions({ options, onChange, color }: Props) {
  const level = (options.level as string) || 'medium'

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-medium text-apple-text block">
        壓縮等級
      </label>
      {LEVELS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange({ ...options, level: opt.value })}
          className="w-full flex items-center gap-3 text-left py-3 px-4 rounded-apple-sm border transition-all duration-200"
          style={{
            borderColor: level === opt.value ? color : 'rgba(0,0,0,0.12)',
            backgroundColor: level === opt.value ? `${color}08` : 'white',
          }}
        >
          <span className="text-[16px]">{opt.icon}</span>
          <div>
            <p
              className="text-[13px] font-semibold"
              style={{ color: level === opt.value ? color : '#1D1D1F' }}
            >
              {opt.label}
            </p>
            <p className="text-[11px] text-apple-secondary">{opt.desc}</p>
          </div>
          {level === opt.value && (
            <div
              className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px]"
              style={{ backgroundColor: color }}
            >
              ✓
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
