import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LightboxProvider } from './state/lightbox'
import { WorkFilterProvider } from './state/workFilter'
import { HomePage } from './pages/HomePage'
import { WorkPage } from './pages/WorkPage'
import { SeriesPage } from './pages/SeriesPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'

function ScrollManager() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  useEffect(() => {
    // 前进/替换导航回到顶部；浏览器后退时保留原滚动位置
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <WorkFilterProvider>
        <LightboxProvider>
          <ScrollManager />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:seriesId" element={<SeriesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </LightboxProvider>
      </WorkFilterProvider>
    </BrowserRouter>
  )
}
