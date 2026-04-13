import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/tools'

const ease = [0.16, 1, 0.3, 1] as unknown as string

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 } as never,
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease } as never,
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease } as never,
  },
}

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 pt-12 pb-24"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue text-[13px] font-medium mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-apple-blue inline-block animate-pulse" />
          免費 · 安全 · 快速
        </motion.div>

        <h1 className="text-[52px] sm:text-[64px] font-bold text-apple-text tracking-tight leading-[1.05] mb-4">
          每個 PDF 問題
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            都有完美解答
          </span>
        </h1>
        <p className="text-[18px] text-apple-secondary max-w-xl mx-auto leading-relaxed">
          合併、分割、壓縮、轉換 — 所有 PDF 工具，一站搞定。
          所有處理在本機完成，檔案完全保密。
        </p>
      </motion.div>

      {/* Categories */}
      {CATEGORIES.map((category) => (
        <motion.section
          key={category.id}
          id={category.id}
          variants={itemVariants}
          className="mb-14"
        >
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h2 className="text-[22px] font-bold text-apple-text tracking-tight">
              {category.name}
            </h2>
          </div>

          {/* Tool Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {category.tools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link
                  to={`/${tool.id}`}
                  className="block bg-white rounded-apple shadow-apple-card hover:shadow-apple-card-hover transition-shadow duration-300 p-5 no-underline group overflow-hidden relative"
                >
                  {/* Background gradient shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${tool.color}10 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-[12px] flex items-center justify-center mb-3.5 text-white text-[18px] font-bold shadow-apple-sm relative"
                    style={{
                      background: `linear-gradient(135deg, ${tool.color}ee, ${tool.color}bb)`,
                    }}
                  >
                    {tool.icon}
                  </div>

                  {/* Text */}
                  <h3 className="text-apple-text font-semibold text-[14px] leading-tight mb-1.5 relative">
                    {tool.name}
                  </h3>
                  <p className="text-apple-secondary text-[12px] leading-relaxed line-clamp-2 relative">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      ))}

      {/* Bottom CTA */}
      <motion.div
        variants={itemVariants}
        className="mt-8 rounded-apple-lg bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100/80 p-12 text-center"
      >
        <h2 className="text-[28px] font-bold text-apple-text mb-3 tracking-tight">
          安全第一，隱私保障
        </h2>
        <p className="text-apple-secondary text-[16px] max-w-md mx-auto mb-6">
          所有 PDF 處理均在您的本機進行，
          不需要網路連線，您的文件永遠不會離開您的裝置。
        </p>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {['🔒 端對端加密', '💻 本機處理', '🚀 極速處理', '🆓 完全免費'].map(
            (item) => (
              <span key={item} className="text-[14px] text-apple-secondary font-medium">
                {item}
              </span>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
