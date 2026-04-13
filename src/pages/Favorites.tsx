import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Folder as FolderIcon, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ChevronRight,
  FolderPlus,
  X,
  Search
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

interface Folder {
  id: string;
  title: string;
  userId: string;
  createdAt: any;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string;
  userId: string;
  createdAt: any;
}

export default function Favorites() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkFolderId, setNewLinkFolderId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const foldersQuery = query(
      collection(db, 'folders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeFolders = onSnapshot(foldersQuery, (snapshot) => {
      const folderData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Folder[];
      setFolders(folderData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'folders');
    });

    const bookmarksQuery = query(
      collection(db, 'bookmarks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeBookmarks = onSnapshot(bookmarksQuery, (snapshot) => {
      const bookmarkData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bookmark[];
      setBookmarks(bookmarkData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookmarks');
    });

    return () => {
      unsubscribeFolders();
      unsubscribeBookmarks();
    };
  }, [user]);

  const handleAddFolder = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newFolderName.trim()) return;

    try {
      await addDoc(collection(db, 'folders'), {
        title: newFolderName.trim(),
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewFolderName('');
      setIsAddFolderOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'folders');
    }
  };

  const handleAddLink = async (e: FormEvent) => {
    e.preventDefault();
    const folderId = newLinkFolderId || selectedFolderId;
    if (!user || !folderId || !newLinkTitle.trim() || !newLinkUrl.trim()) return;

    try {
      await addDoc(collection(db, 'bookmarks'), {
        title: newLinkTitle.trim(),
        url: newLinkUrl.trim(),
        folderId: folderId,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewLinkTitle('');
      setNewLinkUrl('');
      setNewLinkFolderId('');
      setIsAddLinkOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookmarks');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier et tous ses liens ?')) return;

    try {
      // Delete all bookmarks in this folder first
      const folderBookmarks = bookmarks.filter(b => b.folderId === folderId);
      for (const b of folderBookmarks) {
        await deleteDoc(doc(db, 'bookmarks', b.id));
      }
      await deleteDoc(doc(db, 'folders', folderId));
      if (selectedFolderId === folderId) setSelectedFolderId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'folders');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteDoc(doc(db, 'bookmarks', linkId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'bookmarks');
    }
  };

  const filteredBookmarks = bookmarks.filter(b => 
    (selectedFolderId ? b.folderId === selectedFolderId : true) &&
    (searchQuery ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.url.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto px-6 py-12 pb-32"
    >
      <div className="flex justify-between items-center mb-12 border-b border-primary/20 pb-6">
        <div>
          <h2 className="text-4xl font-headline font-bold text-primary flex items-center gap-4">
            <Star className="text-primary" size={32} />
            Mes Favoris
          </h2>
          <p className="text-on-surface-variant text-sm mt-2 font-medium uppercase tracking-[0.2em]">Archives & Ressources Familiales</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAddFolderOpen(true)}
            className="p-4 bg-surface-container text-primary rounded-xl hover:bg-primary/10 transition-all border border-primary/20"
            title="Nouveau Dossier"
          >
            <FolderPlus size={24} />
          </button>
          <button 
            onClick={() => {
              setNewLinkFolderId(selectedFolderId || '');
              setIsAddLinkOpen(true);
            }}
            className="p-4 bg-primary text-on-primary rounded-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all border border-primary/50"
            title="Nouveau Lien"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
        <input 
          type="text"
          placeholder="Rechercher dans les archives..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-surface-container border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/40 font-medium"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Folders List */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary px-2">Répertoires</h3>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedFolderId(null)}
              className={clsx(
                "w-full flex items-center justify-between p-5 rounded-xl transition-all border",
                selectedFolderId === null 
                  ? "bg-primary/10 border-primary text-primary shadow-lg" 
                  : "bg-surface-container border-outline-variant/10 hover:border-primary/30 text-on-surface"
              )}
            >
              <div className="flex items-center gap-4">
                <Star size={20} className={selectedFolderId === null ? "fill-primary" : ""} />
                <span className="font-bold text-sm uppercase tracking-widest">Tous</span>
              </div>
              <span className="text-[10px] font-bold opacity-60 bg-primary/20 px-2 py-0.5 rounded-full">{bookmarks.length}</span>
            </button>

            {folders.map(folder => (
              <div key={folder.id} className="group relative">
                <button
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={clsx(
                    "w-full flex items-center justify-between p-5 rounded-xl transition-all border",
                    selectedFolderId === folder.id 
                      ? "bg-secondary/10 border-secondary text-secondary shadow-lg" 
                      : "bg-surface-container border-outline-variant/10 hover:border-primary/30 text-on-surface"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <FolderIcon size={20} className={selectedFolderId === folder.id ? "fill-secondary" : ""} />
                    <span className="font-bold text-sm uppercase tracking-widest truncate max-w-[140px]">{folder.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold opacity-60 bg-secondary/20 px-2 py-0.5 rounded-full">
                      {bookmarks.filter(b => b.folderId === folder.id).length}
                    </span>
                    <ChevronRight size={16} className={clsx("transition-transform", selectedFolderId === folder.id && "rotate-90")} />
                  </div>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="absolute -right-2 -top-2 p-2 bg-secondary text-on-secondary rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-secondary/50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Links List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center px-2 border-b border-primary/10 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              {selectedFolder ? selectedFolder.title : "Index complet"}
            </h3>
            {selectedFolderId && (
              <button 
                onClick={() => setIsAddLinkOpen(true)}
                className="flex items-center gap-2 text-[10px] font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-lg border border-primary/30 transition-all uppercase tracking-widest"
              >
                <Plus size={14} />
                Nouveau Lien
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBookmarks.length > 0 ? (
                filteredBookmarks.map(bookmark => (
                  <motion.div
                    key={bookmark.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-surface-container-high p-6 rounded-xl border border-primary/5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg border border-primary/20">
                        <LinkIcon size={20} />
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={bookmark.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
                        >
                          <ExternalLink size={20} />
                        </a>
                        <button 
                          onClick={() => handleDeleteLink(bookmark.id)}
                          className="p-2 text-on-surface-variant hover:text-secondary transition-colors hover:bg-secondary/10 rounded-lg"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-headline text-lg text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors">{bookmark.title}</h4>
                    <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest truncate">{bookmark.url}</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-on-surface-variant/20 border-2 border-dashed border-primary/10 rounded-3xl">
                  <Star size={64} className="mb-6 opacity-10 text-primary" />
                  <p className="font-bold uppercase tracking-[0.2em] text-sm">Archive vide</p>
                  {selectedFolderId && (
                    <button 
                      onClick={() => setIsAddLinkOpen(true)}
                      className="mt-6 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                    >
                      Ajouter une entrée
                    </button>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Folder Modal */}
      <AnimatePresence>
        {isAddFolderOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddFolderOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-highest rounded-2xl p-10 shadow-2xl border border-primary/30"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-headline font-bold text-primary">Nouveau Répertoire</h3>
                <button onClick={() => setIsAddFolderOpen(false)} className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors">
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={handleAddFolder} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3 ml-1">Désignation</label>
                  <input 
                    autoFocus
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ex: ARCHIVES_RECETTES"
                    className="w-full px-6 py-5 bg-surface-container border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface font-bold uppercase tracking-widest"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-on-primary rounded-xl font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
                >
                  Valider la création
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Link Modal */}
      <AnimatePresence>
        {isAddLinkOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddLinkOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-highest rounded-2xl p-10 shadow-2xl border border-primary/30"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-headline font-bold text-primary">Nouvelle Entrée</h3>
                <button onClick={() => setIsAddLinkOpen(false)} className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors">
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={handleAddLink} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3 ml-1">Répertoire de destination</label>
                  <select
                    value={newLinkFolderId}
                    onChange={(e) => setNewLinkFolderId(e.target.value)}
                    className="w-full px-6 py-5 bg-surface-container border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface font-bold uppercase tracking-widest appearance-none"
                    required
                  >
                    <option value="" disabled>Sélectionner un dossier</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3 ml-1">Titre de l'entrée</label>
                    <input 
                      autoFocus
                      type="text"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="Ex: GUIDE_TECHNIQUE_POT_AU_FEU"
                      className="w-full px-6 py-5 bg-surface-container border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface font-bold uppercase tracking-widest"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3 ml-1">Localisation (URL)</label>
                    <input 
                      type="url"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-6 py-5 bg-surface-container border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-on-primary rounded-xl font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
                >
                  Enregistrer l'entrée
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
