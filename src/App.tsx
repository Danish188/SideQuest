import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from '@/components/layout/Nav';
import { useScrollTop } from '@/hooks/useScrollTop';
import { AboutPage } from '@/pages/AboutPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { StatsPage } from '@/pages/StatsPage';

export default function App() {
  const location = useLocation();
  useScrollTop(location.pathname);

  return (
    <div className="flex min-h-dvh flex-col">
      <Nav />
      {/* `mode="wait"` keeps one page on screen at a time — cross-fading two full
          layouts reads as a glitch rather than a transition. */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
