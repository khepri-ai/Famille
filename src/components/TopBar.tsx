import { Menu, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { user, profile } = useAuth();
  const avatarUrl = profile?.avatar || user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`;

  return (
    <header className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 py-4 h-16">
      <div className="flex items-center gap-4">
        <button className="text-primary p-2 hover:bg-surface-container transition-colors rounded-full">
          <Menu size={24} />
        </button>
        <h1 className="font-headline text-2xl tracking-tight italic text-primary">La Tanière Familiale</h1>
      </div>
      <Link to="/profile" className="flex items-center hover:scale-105 transition-transform">
        {user ? (
          <img
            src={avatarUrl}
            alt="Portrait"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant ring-2 ring-primary/20">
            <UserIcon size={20} />
          </div>
        )}
      </Link>
    </header>
  );
}
