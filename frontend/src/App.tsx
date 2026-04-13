import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import { TOOLS } from './data/tools'

function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          {TOOLS.map((tool) => (
            <Route
              key={tool.id}
              path={`/${tool.id}`}
              element={<ToolPage tool={tool} />}
            />
          ))}
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
