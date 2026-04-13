import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-apple-bg flex flex-col">
      {/* Top Navigation Bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 glass border-b border-white/60"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-apple-sm group-hover:scale-105 transition-transform duration-200">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="text-apple-text font-semibold text-[15px] tracking-tight">
              FreePDF
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: '整理', hash: '#organize' },
              { label: '優化', hash: '#optimize' },
              { label: '轉換', hash: '#to-pdf' },
              { label: '編輯', hash: '#edit' },
            ].map((item) => (
              <a
                key={item.label}
                href={isHome ? item.hash : `/${item.hash}`}
                className="px-3 py-1.5 text-[13px] text-apple-secondary hover:text-apple-text font-medium rounded-lg hover:bg-black/5 transition-all duration-200 no-underline"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-4 py-1.5 text-[13px] font-medium text-apple-blue hover:bg-apple-blue/8 rounded-full transition-all duration-200 no-underline"
            >
              所有工具
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-apple-border bg-white/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-apple-secondary text-[13px]">
            © 2024 FreePDF — 免費且安全的 PDF 工具箱
          </p>
          <p className="text-apple-secondary/60 text-[12px] mt-1">
            所有檔案處理均在本機完成，不會上傳至任何伺服器
          </p>
        </div>
      </footer>
    </div>
  )
}
