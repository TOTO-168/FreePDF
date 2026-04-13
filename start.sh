#!/bin/bash
# FreePDF 啟動腳本

echo "🚀 啟動 FreePDF..."

# 啟動 Python 後端
cd "$(dirname "$0")/backend"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✅ 後端啟動 (PID: $BACKEND_PID)"

# 啟動前端
cd "$(dirname "$0")/frontend"
npm run dev -- --port 5173 &
FRONTEND_PID=$!
echo "✅ 前端啟動 (PID: $FRONTEND_PID)"

echo ""
echo "🌐 請開啟瀏覽器訪問：http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止所有服務..."

# 等待並清理
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '已停止所有服務'" EXIT
wait
