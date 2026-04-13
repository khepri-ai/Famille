import { Menu, User as UserIcon, X, Home, Calendar, Image, Star, Users, UtensilsCrossed } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

export default function TopBar() {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarUrl = profile?.avatar || user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`;

  const menuItems = [
    { label: 'Accueil', path: '/', icon: Home },
    { label: 'Agenda', path: '/planning', icon: Calendar },
    { label: 'Albums', path: '/photos', icon: Image },
    { label: 'Favoris', path: '/favorites', icon: Star },
    { label: 'Tribu', path: '/gps', icon: Users },
    { label: 'Cuisine', path: '/recipes', icon: UtensilsCrossed },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md flex justify-between items-center px-6 py-4 h-20 border-b border-primary/20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="text-primary p-2 hover:bg-primary/10 transition-colors rounded-lg border border-transparent hover:border-primary/20"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">La Tanière</h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold -mt-1">Dossier Technique Familial</span>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              ref={menuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-64 bg-surface z-[70] shadow-2xl border-r border-primary/20 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                  <span className="text-primary font-bold tracking-[0.3em] uppercase text-[8px] mb-1">Navigation</span>
                  <h2 className="font-headline text-2xl font-bold text-on-surface">Menu</h2>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-1.5 flex-grow">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => clsx(
                      "flex items-center gap-4 p-4 rounded-lg transition-all border group",
                      isActive 
                        ? "bg-primary/10 border-primary text-primary shadow-sm" 
                        : "bg-surface-container border-transparent hover:border-primary/20 text-on-surface-variant hover:text-primary"
                    )}
                  >
                    <item.icon size={20} className={clsx("transition-transform group-hover:scale-110")} />
                    <span className="font-bold uppercase tracking-[0.15em] text-[10px]">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-primary/10">
                <Link 
                  to="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-primary/5 hover:border-primary/20 transition-all"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-primary to-primary-container">
                    <img
                      src={avatarUrl}
                      alt="Portrait"
                      className="w-10 h-10 rounded-full object-cover border-2 border-surface"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-on-surface">{profile?.name || user?.displayName || 'Utilisateur'}</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Voir le profil</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Link to="/profile" className="flex items-center hover:scale-105 transition-transform">
        {user ? (
          <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-primary to-primary-container">
            <img
              src={avatarUrl}
              alt="Portrait"
              className="w-10 h-10 rounded-full object-cover border-2 border-surface"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary border border-primary/30">
            <UserIcon size={20} />
          </div>
        )}
      </Link>
    </header>
  );
}
