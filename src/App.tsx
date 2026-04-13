import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Planning from './pages/Planning';
import Photos from './pages/Photos';
import Recipes from './pages/Recipes';
import Favorites from './pages/Favorites';
import GPS from './pages/GPS';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary/20">
          <TopBar />
          <main className="pb-24">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/photos" element={<Photos />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/gps" element={<GPS />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </AnimatePresence>
          </main>
          <BottomNav />
        </div>
      </AuthProvider>
    </Router>
  );
}
