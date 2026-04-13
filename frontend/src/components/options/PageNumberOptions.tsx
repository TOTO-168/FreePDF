interface Props {
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
  color: string
}

export default function PageNumberOptions({ options, onChange, color }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-2">
          位置
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'bottom-center', label: '底部置中' },
            { value: 'bottom-right', label: '底部右側' },
            { value: 'bottom-left', label: '底部左側' },
            { value: 'top-center', label: '頂部置中' },
            { value: 'top-right', label: '頂部右側' },
            { value: 'top-left', label: '頂部左側' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...options, position: opt.value })}
              className="py-2 px-2 rounded-apple-sm text-[12px] font-medium border transition-all text-center"
              style={{
                borderColor: options.position === opt.value ? color : 'rgba(0,0,0,0.1)',
                backgroundColor: options.position === opt.value ? `${color}10` : 'white',
                color: options.position === opt.value ? color : '#86868B',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-2">
          格式
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'n', label: '1, 2, 3' },
            { value: 'page-n', label: '第 1 頁' },
            { value: 'n-of-total', label: '1 / 10' },
            { value: 'roman', label: 'I, II, III' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...options, format: opt.value })}
              className="py-2.5 px-3 rounded-apple-sm text-[12px] font-medium border transition-all"
              style={{
                borderColor: options.format === opt.value ? color : 'rgba(0,0,0,0.1)',
                backgroundColor: options.format === opt.value ? `${color}10` : 'white',
                color: options.format === opt.value ? color : '#86868B',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-1.5">
          起始頁碼
        </label>
        <input
          type="number"
          min={1}
          placeholder="1"
          value={(options.startPage as string) || ''}
          onChange={(e) => onChange({ ...options, startPage: e.target.value })}
          className="w-full px-3 py-2.5 rounded-apple-sm border border-apple-border text-[13px] outline-none focus:border-apple-blue transition-colors"
        />
      </div>
    </div>
  )
}
