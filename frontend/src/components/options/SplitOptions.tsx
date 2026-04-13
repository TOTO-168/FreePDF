interface Props {
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
  color: string
}

export default function SplitOptions({ options, onChange, color }: Props) {
  const mode = (options.mode as string) || 'all'

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-2">
          拆分方式
        </label>
        <div className="space-y-2">
          {[
            { value: 'all', label: '每頁一個檔案', desc: '將每一頁分割為獨立的 PDF' },
            { value: 'range', label: '按頁面範圍', desc: '例如：1-3, 4-6, 7' },
            { value: 'interval', label: '固定間隔', desc: '每 N 頁分割一次' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...options, mode: opt.value })}
              className="w-full text-left py-3 px-4 rounded-apple-sm border transition-all duration-200"
              style={{
                borderColor: mode === opt.value ? color : 'rgba(0,0,0,0.12)',
                backgroundColor: mode === opt.value ? `${color}08` : 'white',
              }}
            >
              <p className="text-[13px] font-medium" style={{ color: mode === opt.value ? color : '#1D1D1F' }}>
                {opt.label}
              </p>
              <p className="text-[12px] text-apple-secondary mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {mode === 'range' && (
        <div>
          <label className="text-[13px] font-medium text-apple-text block mb-1.5">
            頁面範圍
          </label>
          <input
            type="text"
            placeholder="例如：1-3, 5, 7-10"
            value={(options.ranges as string) || ''}
            onChange={(e) => onChange({ ...options, ranges: e.target.value })}
            className="w-full px-3 py-2.5 rounded-apple-sm border border-apple-border text-[13px] text-apple-text outline-none focus:border-apple-blue transition-colors"
          />
        </div>
      )}

      {mode === 'interval' && (
        <div>
          <label className="text-[13px] font-medium text-apple-text block mb-1.5">
            每幾頁分割
          </label>
          <input
            type="number"
            min={1}
            placeholder="例如：5"
            value={(options.interval as string) || ''}
            onChange={(e) => onChange({ ...options, interval: e.target.value })}
            className="w-full px-3 py-2.5 rounded-apple-sm border border-apple-border text-[13px] text-apple-text outline-none focus:border-apple-blue transition-colors"
          />
        </div>
      )}
    </div>
  )
}
