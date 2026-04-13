import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, MapPin, Shield, Bell, LogOut, ChevronRight, Edit2, Check, X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, profile, loading, login, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<any>(null);

  // Initialize tempUser when profile is loaded
  useEffect(() => {
    if (profile) {
      setTempUser({ ...profile });
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 pt-20 text-center space-y-8"
      >
        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
          <User size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-headline">Connectez-vous</h2>
          <p className="text-on-surface-variant">Rejoignez votre tribu pour partager votre position et vos moments en famille.</p>
        </div>
        <button
          onClick={login}
          className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-primary/90 transition-all active:scale-95"
        >
          <LogIn size={20} />
          Se connecter avec Google
        </button>
      </motion.div>
    );
  }

  const handleSave = async () => {
    if (!tempUser) return;
    setIsSaving(true);
    setError(null);
    let newPosition = tempUser.position;

    // Only geocode if address changed
    if (tempUser.address !== profile?.address) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(tempUser.address)}&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          newPosition = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } else {
          setError("Adresse introuvable sur la carte.");
          setIsSaving(false);
          return;
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setError("Erreur lors de la recherche de l'adresse.");
        setIsSaving(false);
        return;
      }
    }

    try {
      await updateProfile({ ...tempUser, position: newPosition });
      setIsEditing(false);
    } catch (err) {
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempUser({ ...profile });
    setIsEditing(false);
    setError(null);
  };

  const displayUser = tempUser || profile || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto px-6 pt-8 pb-32 space-y-8"
    >
      <section className="text-center space-y-4">
        <div className="relative inline-block">
          <img 
            src={displayUser.avatar || user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`} 
            alt={displayUser.name} 
            className="w-32 h-32 rounded-full border-4 border-surface-container-high shadow-xl object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg border-2 border-surface">
            <User size={16} />
          </div>
        </div>
        <div>
          <h2 className="font-headline text-3xl font-bold text-on-surface">{displayUser.name}</h2>
          <p className="text-primary font-semibold uppercase tracking-widest text-xs mt-1">{displayUser.role}</p>
        </div>
      </section>

      <div className="space-y-6">
        <section className="bg-surface-container rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-headline text-xl font-bold">Informations personnelles</h3>
            {!isEditing ? (
              <button 
                onClick={() => {
                  setError(null);
                  setIsEditing(true);
                }}
                className="p-2 hover:bg-surface-container-high rounded-full text-primary transition-colors"
              >
                <Edit2 size={18} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="p-2 hover:bg-error-container/20 rounded-full text-error transition-colors"
                >
                  <X size={18} />
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2 hover:bg-primary-container/20 rounded-full text-primary transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Check size={18} className="opacity-50" />
                    </motion.div>
                  ) : (
                    <Check size={18} />
                  )}
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-4 mb-2 p-2 bg-error-container/20 text-error text-xs font-bold rounded-lg text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <div className="flex-grow">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Nom complet</p>
                {isEditing ? (
                  <input 
                    type="text"
                    value={displayUser.name}
                    onChange={(e) => setTempUser({ ...displayUser, name: e.target.value })}
                    className="w-full bg-surface-container-highest border-b-2 border-primary px-2 py-1 rounded-t-md focus:outline-none font-medium"
                  />
                ) : (
                  <p className="font-medium">{displayUser.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                <Mail size={20} />
              </div>
              <div className="flex-grow">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Email</p>
                {isEditing ? (
                  <input 
                    type="email"
                    value={displayUser.email}
                    onChange={(e) => setTempUser({ ...displayUser, email: e.target.value })}
                    className="w-full bg-surface-container-highest border-b-2 border-primary px-2 py-1 rounded-t-md focus:outline-none font-medium"
                  />
                ) : (
                  <p className="font-medium">{displayUser.email}</p>
                )}
              </div>
            </div>

            <div className="relative group">
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <MapPin size={20} />
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Adresse</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={displayUser.address}
                      onChange={(e) => setTempUser({ ...displayUser, address: e.target.value })}
                      className="w-full bg-surface-container-highest border-b-2 border-primary px-2 py-1 rounded-t-md focus:outline-none font-medium"
                    />
                  ) : (
                    <p className="font-medium">{displayUser.address || "Non renseignée"}</p>
                  )}
                </div>
                {!isEditing && (
                  <Link to="/gps" className="text-on-surface-variant hover:text-primary transition-colors">
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container rounded-2xl p-6 space-y-2 shadow-sm">
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer">
            <Shield size={20} className="text-on-surface-variant" />
            <span className="font-medium flex-grow">Confidentialité & Sécurité</span>
            <ChevronRight size={18} className="text-on-surface-variant" />
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer">
            <Bell size={20} className="text-on-surface-variant" />
            <span className="font-medium flex-grow">Notifications</span>
            <ChevronRight size={18} className="text-on-surface-variant" />
          </div>
          <div className="pt-4 mt-4 border-t border-outline-variant/30">
            <div 
              onClick={logout}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-error-container/20 text-error transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span className="font-bold">Déconnexion</span>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
