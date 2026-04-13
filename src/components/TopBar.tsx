import { Menu, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { user, profile } = useAuth();
  const avatarUrl = profile?.avatar || user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`;

  return (
    <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md flex justify-between items-center px-6 py-4 h-20 border-b border-primary/20">
      <div className="flex items-center gap-4">
        <button className="text-primary p-2 hover:bg-surface-container transition-colors rounded-lg">
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">La Tanière</h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold -mt-1">Dossier Technique Familial</span>
        </div>
      </div>
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
