import { Home, Calendar, Image, UtensilsCrossed, Users, ChevronUp, MapPin, User, Star } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const STATIC_FAMILY = [
  { id: 2, name: 'Elena', role: 'Mother', position: [48.8606, 2.3376] },
  { id: 3, name: 'Thomas', role: 'Son', position: [48.8534, 2.3488] },
];

export default function BottomNav() {
  const { profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([...STATIC_FAMILY]);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let updatedMembers = [...STATIC_FAMILY];
    if (profile) {
      updatedMembers = [
        { id: 1, name: profile.name, role: profile.role, position: profile.position || [48.8584, 2.2945] },
        ...STATIC_FAMILY
      ];
    } else {
      updatedMembers = [
        { id: 1, name: 'Marc', role: 'Father', position: [48.8584, 2.2945] },
        ...STATIC_FAMILY
      ];
    }
    setFamilyMembers(updatedMembers);
  }, [profile]);

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

  const handleLocate = (memberId: number) => {
    setIsMenuOpen(false);
    navigate('/gps', { state: { focusId: memberId } });
  };

  const handleGoToProfile = (memberId: number) => {
    setIsMenuOpen(false);
    if (memberId === 1) {
      navigate('/profile');
    } else {
      // For now, only the main user has a profile page
      // We could add a generic member view later
      navigate('/profile'); 
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/95 backdrop-blur-xl border-t border-primary/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
      <NavLink
        to="/"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-xl',
            isActive
              ? 'bg-primary/10 text-primary scale-105'
              : 'text-on-surface-variant hover:text-primary hover:scale-105'
          )
        }
      >
        <Home size={22} className="mb-1" />
        <span className="font-body text-[10px] font-bold uppercase tracking-widest">Accueil</span>
      </NavLink>

      <NavLink
        to="/planning"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-xl',
            isActive
              ? 'bg-primary/10 text-primary scale-105'
              : 'text-on-surface-variant hover:text-primary hover:scale-105'
          )
        }
      >
        <Calendar size={22} className="mb-1" />
        <span className="font-body text-[10px] font-bold uppercase tracking-widest">Agenda</span>
      </NavLink>

      <NavLink
        to="/photos"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-xl',
            isActive
              ? 'bg-primary/10 text-primary scale-105'
              : 'text-on-surface-variant hover:text-primary hover:scale-105'
          )
        }
      >
        <Image size={22} className="mb-1" />
        <span className="font-body text-[10px] font-bold uppercase tracking-widest">Albums</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-xl',
            isActive
              ? 'bg-primary/10 text-primary scale-105'
              : 'text-on-surface-variant hover:text-primary hover:scale-105'
          )
        }
      >
        <Star size={22} className="mb-1" />
        <span className="font-body text-[10px] font-bold uppercase tracking-widest">Favoris</span>
      </NavLink>

      {/* Tribu Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-xl',
            isMenuOpen
              ? 'bg-primary text-on-primary scale-105 shadow-lg shadow-primary/20'
              : 'text-on-surface-variant hover:text-primary hover:scale-105'
          )}
        >
          <Users size={22} className="mb-1" />
          <span className="font-body text-[10px] font-bold uppercase tracking-widest">Tribu</span>
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 bg-surface-container-highest rounded-2xl shadow-2xl border border-primary/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 border-b border-primary/10 bg-surface-container-highest">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Membres de la famille</p>
            </div>
            <div className="max-h-80 overflow-y-auto no-scrollbar">
              {familyMembers.map((member) => (
                <div 
                  key={member.id}
                  className="px-4 py-4 hover:bg-primary/5 transition-colors flex items-center justify-between group/item border-b border-outline-variant/10 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface text-sm">{member.name}</span>
                    <span className="text-[10px] text-primary/70 font-bold uppercase tracking-wider">{member.role}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleLocate(member.id)}
                      className="p-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all"
                      title="Situer sur la carte"
                    >
                      <MapPin size={16} />
                    </button>
                    <button 
                      onClick={() => handleGoToProfile(member.id)}
                      className="p-2.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary hover:text-on-secondary transition-all"
                      title="Voir le profil"
                    >
                      <User size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavLink
        to="/recipes"
        className={({ isActive }) =>
          clsx(
            'flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-xl',
            isActive
              ? 'bg-primary/10 text-primary scale-105'
              : 'text-on-surface-variant hover:text-primary hover:scale-105'
          )
        }
      >
        <UtensilsCrossed size={22} className="mb-1" />
        <span className="font-body text-[10px] font-bold uppercase tracking-widest">Cuisine</span>
      </NavLink>
    </nav>
  );
}
