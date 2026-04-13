import { motion } from 'motion/react';
import { Calendar as CalendarIcon, MapPin, ArrowRight, Play, ChevronRight, CalendarDays, Camera, Compass, Cloud, FileText, Utensils, Link as LinkIcon, Gamepad2, Plus, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const shortcuts = [
  { icon: CalendarDays, label: 'Planning', color: 'bg-primary-fixed', textColor: 'text-primary', path: '/planning' },
  { icon: Camera, label: 'Photo/Vidéo', color: 'bg-secondary-fixed', textColor: 'text-secondary', path: '/photos' },
  { icon: Compass, label: 'GPS Famille', color: 'bg-tertiary-fixed', textColor: 'text-tertiary', path: '/gps' },
  { icon: Cloud, label: 'Le Cloud', color: 'bg-primary-fixed', textColor: 'text-primary', path: '#' },
  { icon: FileText, label: 'Notes', color: 'bg-tertiary-fixed', textColor: 'text-tertiary', path: '#' },
  { icon: Utensils, label: 'Recettes', color: 'bg-secondary-fixed', textColor: 'text-secondary', path: '/recipes' },
  { icon: Star, label: 'Favoris', color: 'bg-primary-fixed', textColor: 'text-primary', path: '/favorites' },
  { icon: Gamepad2, label: 'Jeux', color: 'bg-tertiary-fixed', textColor: 'text-tertiary', path: '#' },
];

const recipes = [
  {
    title: 'Pesto maison de Grand-Père',
    author: 'Philippe',
    time: 'Il y a 2j',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_O9cXXLgw9mKvOpRzUIyACZChc9UgPa2eI8vV0yJWmy0Bqd4cduWl5QC7XDsfAi0Il7pS0N5gA2tNxnONBOxNyg2VxJxk4Fsdn1AVv2uPlTG92m9MnO3WJdTV8Ro6LUjk7qGeriKlozF94QmK9oXKxGScbIwlDfP3tnI3Bn4JQBtoO1sSCH3tw-sZqBsGoTT7fciYjQITrYYGQimw3N29myHDU31Pxn1E4i6p5FTgBZ6y0wfZ1wqLhaulJz6gCL5VnnvrphvFnfU'
  },
  {
    title: 'Pizza du Vendredi Soir',
    author: 'Louise',
    time: 'Il y a 5j',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbC-D0OVUreqcXulYBnMlRZgTpNOk_cZqL6h6F8MHsClSpcgM_D2whNnvkaOX65KpXbG2U2kAlUVdSc15NFCD22rsYgp4w3kdTZLnEn7hPGvFooqtdvZXpKM_um5l4ZudmYFSj7TjTZpU7bS6inJ5FzDZLUohk2IQdJskjlnJldxrZkcVWx1kf_9s7hQXEbZlQe7gxqZnhleOYSzZtz5BPfkoEPja4Tti8lpbbR4GrFxqtlfLN0-1943unuiKR3hZrPUkqrxjcHhU'
  }
];

export default function Home() {
  const { profile, user } = useAuth();
  const firstName = profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'la famille';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-6 pt-8 pb-32 space-y-12"
    >
      <section className="space-y-2">
        <h2 className="font-headline text-5xl font-bold text-primary tracking-tight">Bonjour {firstName} !</h2>
        <p className="text-on-surface-variant font-medium text-lg italic opacity-80">Ravis de vous revoir au foyer.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-primary-container rounded-xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden group border border-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <CalendarIcon size={120} className="text-primary" />
          </div>
          <div className="z-10">
            <span className="inline-block px-4 py-1.5 bg-primary/20 rounded-full text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-6 border border-primary/30">Prochain Événement</span>
            <h3 className="font-headline text-4xl font-bold text-on-surface leading-tight mb-4">Déjeuner chez Mamie</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <CalendarIcon size={20} className="text-primary" />
                <span className="font-bold">Dimanche, 12:30</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <MapPin size={20} className="text-primary" />
                <span className="font-bold">La Campagne</span>
              </div>
            </div>
          </div>
          <button className="z-10 w-fit mt-8 px-8 py-4 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/10">
            Voir les détails
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="bg-surface-container-high rounded-xl overflow-hidden flex flex-col group border border-outline-variant/10">
          <div className="h-48 overflow-hidden relative">
            <img
              src="https://picsum.photos/seed/family/800/600"
              alt="Family gathering recap"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.5] hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent flex items-end p-4">
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Récap Octobre</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary/40">
              <Play size={24} className="text-primary fill-current" />
            </div>
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <p className="font-headline text-xl text-on-surface leading-snug">Les meilleurs moments de notre automne à la maison.</p>
            <button className="mt-4 text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-widest">
              Explorer
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h4 className="font-headline text-2xl font-bold text-primary border-b border-primary/10 pb-2">Raccourcis rapides</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {shortcuts.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="bg-surface-container-low hover:bg-primary/5 border border-outline-variant/10 hover:border-primary/30 transition-all rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center active:scale-95 group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <item.icon size={28} />
              </div>
              <span className="font-bold text-xs text-on-surface uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <h4 className="font-headline text-2xl font-bold text-primary">Dernières Recettes</h4>
            <button className="text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">Tout voir</button>
          </div>
          <div className="space-y-4">
            {recipes.map((recipe, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/5 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-primary/10">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">{recipe.title}</p>
                  <p className="text-[10px] text-primary/70 font-bold mt-1 uppercase tracking-widest">Par {recipe.author} • {recipe.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <h4 className="font-headline text-2xl font-bold text-primary">Post-its du jour</h4>
            <button className="text-primary hover:scale-110 transition-transform">
              <Plus size={28} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-primary-container/30 border border-primary/20 rounded-xl relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl"></div>
              <p className="font-headline italic text-on-surface leading-tight text-xl">Ne pas oublier les fleurs pour maman !</p>
              <span className="absolute bottom-4 right-6 text-[10px] uppercase tracking-widest text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Urgent</span>
            </div>
            <div className="p-6 bg-secondary-container/10 border border-secondary/20 rounded-xl relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary rounded-l-xl"></div>
              <p className="font-headline italic text-on-surface leading-tight text-xl">Réserver le court de tennis pour samedi 10h.</p>
              <span className="absolute bottom-4 right-6 text-[10px] uppercase tracking-widest text-secondary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Loisirs</span>
            </div>
          </div>
        </div>
      </section>

      <button className="fixed bottom-32 right-6 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-surface">
        <Plus size={32} />
      </button>
    </motion.div>
  );
}
