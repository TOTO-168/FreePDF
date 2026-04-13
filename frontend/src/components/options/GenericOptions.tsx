import type { Tool } from '../../data/tools'

interface Props {
  tool: Tool
  options: Record<string, unknown>
  onChange: (o: Record<string, unknown>) => void
}

export default function GenericOptions({ tool }: Props) {
  return (
    <div className="text-center py-4">
      <p className="text-apple-secondary text-[13px]">
        上傳檔案後，點擊「開始{tool.name}」即可處理
      </p>
    </div>
  )
}
