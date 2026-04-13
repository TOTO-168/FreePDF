interface Props {
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
  color: string
}

export default function WatermarkOptions({ options, onChange, color }: Props) {
  const type = (options.type as string) || 'text'

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[13px] font-medium text-apple-text block mb-2">
          浮水印類型
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'text', label: '文字浮水印' },
            { value: 'image', label: '圖片浮水印' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...options, type: opt.value })}
              className="py-2.5 px-4 rounded-apple-sm text-[13px] font-medium border transition-all duration-200"
              style={{
                borderColor: type === opt.value ? color : 'rgba(0,0,0,0.12)',
                backgroundColor: type === opt.value ? `${color}10` : 'white',
                color: type === opt.value ? color : '#86868B',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {type === 'text' && (
        <>
          <div>
            <label className="text-[13px] font-medium text-apple-text block mb-1.5">
              浮水印文字
            </label>
            <input
              type="text"
              placeholder="例如：機密文件"
              value={(options.text as string) || ''}
              onChange={(e) => onChange({ ...options, text: e.target.value })}
              className="w-full px-3 py-2.5 rounded-apple-sm border border-apple-border text-[13px] outline-none focus:border-apple-blue transition-colors"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-apple-text block mb-2">
              透明度：{Math.round(((options.opacity as number) || 0.3) * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={(options.opacity as number) || 0.3}
              onChange={(e) => onChange({ ...options, opacity: parseFloat(e.target.value) })}
              className="w-full accent-apple-blue"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-apple-text block mb-2">
              位置
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['左上', '置中', '右下', '對角', '重複', '自訂'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => onChange({ ...options, position: pos })}
                  className="py-2 text-[12px] font-medium rounded-lg border transition-all"
                  style={{
                    borderColor: options.position === pos ? color : 'rgba(0,0,0,0.1)',
                    backgroundColor: options.position === pos ? `${color}10` : 'transparent',
                    color: options.position === pos ? color : '#86868B',
                  }}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
