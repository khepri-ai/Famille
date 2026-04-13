import { Home, Calendar, Image, UtensilsCrossed, Users, ChevronUp, MapPin, User } from 'lucide-react';
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
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 bg-surface-container-high rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-3 border-b border-outline-variant/30 bg-surface-container-highest">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Membres de la famille</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {familyMembers.map((member) => (
                <div 
                  key={member.id}
                  className="px-4 py-3 hover:bg-surface-container-highest transition-colors flex items-center justify-between group/item"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface text-sm">{member.name}</span>
                    <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter">{member.role}</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleLocate(member.id)}
                      className="p-2 bg-primary-container/30 text-primary rounded-full hover:bg-primary hover:text-on-primary transition-all"
                      title="Situer sur la carte"
                    >
                      <MapPin size={14} />
                    </button>
                    <button 
                      onClick={() => handleGoToProfile(member.id)}
                      className="p-2 bg-secondary-container/30 text-secondary rounded-full hover:bg-secondary hover:text-on-secondary transition-all"
                      title="Voir le profil"
                    >
                      <User size={14} />
                    </button>
                  </div>
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
