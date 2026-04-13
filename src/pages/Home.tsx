import { motion } from 'motion/react';
import { Calendar as CalendarIcon, MapPin, ArrowRight, Play, ChevronRight, CalendarDays, Camera, Compass, Cloud, FileText, Utensils, Link as LinkIcon, Gamepad2, Plus } from 'lucide-react';
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
  { icon: LinkIcon, label: 'Favoris', color: 'bg-primary-fixed', textColor: 'text-primary', path: '#' },
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
        <h2 className="font-headline text-5xl font-bold text-on-surface tracking-tight">Bonjour {firstName} !</h2>
        <p className="text-on-surface-variant font-medium text-lg italic opacity-80">Ravis de vous revoir au foyer.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-secondary-fixed rounded-xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <CalendarIcon size={120} />
          </div>
          <div className="z-10">
            <span className="inline-block px-4 py-1.5 bg-on-secondary-fixed/10 rounded-full text-on-secondary-fixed-variant font-semibold text-xs uppercase tracking-widest mb-6">Prochain Événement</span>
            <h3 className="font-headline text-4xl font-bold text-on-secondary-fixed leading-tight mb-4">Déjeuner chez Mamie</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-on-secondary-fixed-variant">
                <CalendarIcon size={20} />
                <span className="font-semibold">Dimanche, 12:30</span>
              </div>
              <div className="flex items-center gap-2 text-on-secondary-fixed-variant">
                <MapPin size={20} />
                <span className="font-semibold">La Campagne</span>
              </div>
            </div>
          </div>
          <button className="z-10 w-fit mt-8 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm">
            Voir les détails
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="bg-surface-container-high rounded-xl overflow-hidden flex flex-col group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRNo8OWVE8HBl83_ppq59tfkRpLplhfQNEvQuZRZ6_rJwkAfIYh20pCUuAbk0EQ74QK2nnYv5IaYU7Pv_9xEkMHUn7xrCnC9bfBfNQewyEqIIIkuam_gEuzQ8vcy90gB4wYBiMvnuwQ8dBTG2l191r-SdWeOZGZc1W_9MumHrnXesL3YE3ixVJVkCibkqdo-SKZtS0SDiC6r2-lpomiOoklN979sqSAQnwRsTfdGD3HUOc7_QdeJVbLM8J2-ktM3la_p-spyR6jT0"
              alt="Family gathering recap"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold uppercase tracking-widest">Récap Octobre</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
              <Play size={24} className="text-white fill-current" />
            </div>
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <p className="font-headline text-xl text-on-surface leading-snug">Les meilleurs moments de notre automne à la maison.</p>
            <button className="mt-4 text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Explorer les albums
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h4 className="font-headline text-2xl font-bold text-on-surface">Raccourcis rapides</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {shortcuts.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="bg-surface-container hover:bg-surface-container-highest transition-all rounded-lg p-6 flex flex-col items-center justify-center gap-3 text-center active:scale-95"
            >
              <div className={clsx('w-14 h-14 rounded-full flex items-center justify-center', item.color)}>
                <item.icon className={clsx('text-3xl', item.textColor)} size={28} />
              </div>
              <span className="font-bold text-sm text-on-surface">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl font-bold">Dernières Recettes</h4>
            <button className="text-primary font-bold text-sm">Tout voir</button>
          </div>
          <div className="space-y-4">
            {recipes.map((recipe, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{recipe.title}</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-wider">Ajouté par {recipe.author} • {recipe.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h4 className="font-headline text-2xl font-bold">Post-its du jour</h4>
            <button className="text-primary">
              <Plus size={24} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-[#fff8b5] rounded-lg shadow-sm transform -rotate-1 hover:rotate-0 transition-transform">
              <p className="font-headline italic text-on-surface leading-tight text-lg">Ne pas oublier les fleurs pour maman !</p>
            </div>
            <div className="p-5 bg-[#ffcfcf] rounded-lg shadow-sm transform rotate-2 hover:rotate-0 transition-transform">
              <p className="font-headline italic text-on-surface leading-tight text-lg">Réserver le court de tennis pour samedi 10h.</p>
            </div>
          </div>
        </div>
      </section>

      <button className="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40">
        <Plus size={32} />
      </button>
    </motion.div>
  );
}
