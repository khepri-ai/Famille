import { Home, Calendar, Image, UtensilsCrossed, Users, ChevronUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useState, useEffect, useRef } from 'react';

const STATIC_FAMILY = [
  { id: 2, name: 'Elena', role: 'Mother' },
  { id: 3, name: 'Thomas', role: 'Son' },
];

export default function BottomNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([...STATIC_FAMILY]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('family_app_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFamilyMembers([
        { id: 1, name: user.name, role: user.role },
        ...STATIC_FAMILY
      ]);
    } else {
      setFamilyMembers([
        { id: 1, name: 'Marc', role: 'Father' },
        ...STATIC_FAMILY
      ]);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-4px_40px_rgba(27,29,14,0.06)]">
      <NavLink
        to="/"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-full',
            isActive
              ? 'bg-surface-container text-primary scale-105'
              : 'text-on-surface/50 hover:scale-105'
          )
        }
      >
        <Home size={24} className="mb-1" />
        <span className="font-body text-[11px] font-semibold uppercase tracking-wider">Home</span>
      </NavLink>

      <NavLink
        to="/planning"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-full',
            isActive
              ? 'bg-surface-container text-primary scale-105'
              : 'text-on-surface/50 hover:scale-105'
          )
        }
      >
        <Calendar size={24} className="mb-1" />
        <span className="font-body text-[11px] font-semibold uppercase tracking-wider">Planning</span>
      </NavLink>

      <NavLink
        to="/photos"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-full',
            isActive
              ? 'bg-surface-container text-primary scale-105'
              : 'text-on-surface/50 hover:scale-105'
          )
        }
      >
        <Image size={24} className="mb-1" />
        <span className="font-body text-[11px] font-semibold uppercase tracking-wider">Photos</span>
      </NavLink>

      {/* Tribu Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-full',
            isMenuOpen
              ? 'bg-primary text-on-primary scale-105'
              : 'text-on-surface/50 hover:scale-105'
          )}
        >
          <Users size={24} className="mb-1" />
          <span className="font-body text-[11px] font-semibold uppercase tracking-wider">Tribu</span>
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-surface-container-high rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-3 border-b border-outline-variant/30 bg-surface-container-highest">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Membres de la famille</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {familyMembers.map((member) => (
                <div 
                  key={member.id}
                  className="px-4 py-3 hover:bg-surface-container-highest transition-colors flex flex-col cursor-default"
                >
                  <span className="font-bold text-on-surface text-sm">{member.name}</span>
                  <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter">{member.role}</span>
                </div>
              ))}
            </div>
            <div className="p-2 bg-surface-container-highest/50 flex justify-center">
              <ChevronUp size={16} className="text-on-surface-variant animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <NavLink
        to="/recipes"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-full',
            isActive
              ? 'bg-surface-container text-primary scale-105'
              : 'text-on-surface/50 hover:scale-105'
          )
        }
      >
        <UtensilsCrossed size={24} className="mb-1" />
        <span className="font-body text-[11px] font-semibold uppercase tracking-wider">Recipes</span>
      </NavLink>
    </nav>
  );
}
