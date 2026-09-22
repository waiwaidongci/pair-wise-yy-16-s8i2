import { Navigate, Route, Routes } from "react-router-dom";
import { LightboxProvider } from "./context/LightboxContext";
import { WorkFilterProvider } from "./context/WorkFilterContext";
import { Header } from "./components/Header";
import { Lightbox } from "./components/Lightbox";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { Series } from "./pages/Series";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

export default function App() {
  return (
    <WorkFilterProvider>
      <LightboxProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:seriesId" element={<Series />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="site-footer">
          <div className="gold-rule" aria-hidden="true" />
          <p>© 2026 林澜 · 高原纪实摄影 — 本站可离线访问，字体与图片均来自本地。</p>
        </footer>
        {/* 全局共享灯箱：不是路由，任何页面都能复用 */}
        <Lightbox />
      </LightboxProvider>
    </WorkFilterProvider>
  );
}
