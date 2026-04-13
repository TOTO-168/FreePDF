interface Props {
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
  color: string
}

export default function MergeOptions({ options, onChange, color }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-2">
          排列方式
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'order', label: '依上傳順序' },
            { value: 'name', label: '依檔名排序' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...options, sortBy: opt.value })}
              className="py-2.5 px-4 rounded-apple-sm text-[13px] font-medium border transition-all duration-200"
              style={{
                borderColor: options.sortBy === opt.value ? color : 'rgba(0,0,0,0.12)',
                backgroundColor: options.sortBy === opt.value ? `${color}10` : 'white',
                color: options.sortBy === opt.value ? color : '#86868B',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-apple-secondary text-[12px]">
        上傳多個 PDF 後可在檔案列表中拖曳調整順序
      </p>
    </div>
  )
}
