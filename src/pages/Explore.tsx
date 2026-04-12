import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { MIS_VIAJES, MIS_FOTOS } from '../data/mis_viajes';
import { Search, Tag as TagIcon, X, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

interface PhotoItem {
  url: string;
  caption: string;
  tags: string[];
  ubicacion: string;
  titulo: string;
  tripId?: string;
}

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const allPhotos = useMemo(() => {
    const photos: PhotoItem[] = [];
    MIS_VIAJES.forEach(viaje => {
      if (viaje.galeria) {
        viaje.galeria.forEach(item => {
          const url = typeof item === 'string' ? item : item.url;
          const caption = typeof item === 'string' ? '' : item.caption || '';
          const tags = typeof item === 'string' ? [] : item.tags || [];
          photos.push({ url, caption, tags, ubicacion: viaje.ubicacion, titulo: viaje.titulo, tripId: viaje.id });
        });
      }
    });
    MIS_FOTOS.forEach(foto => {
      if (foto.galeriaTematica) {
        foto.galeriaTematica.forEach(item => {
          const url = typeof item === 'string' ? item : item.url;
          const caption = typeof item === 'string' ? '' : item.caption || '';
          const tags = typeof item === 'string' ? [] : item.tags || [];
          photos.push({ url, caption, tags, ubicacion: foto.ubicacion, titulo: foto.titulo });
        });
      }
    });
    return photos;
  }, []);

  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {};
    allPhotos.forEach(photo => photo.tags.forEach(tag => counts[tag] = (counts[tag] || 0) + 1));
    const sortedTags = Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 40);
    const maxCount = Math.max(...sortedTags.map(t => t.count), 1);
    const minCount = Math.min(...sortedTags.map(t => t.count), 1);
    return sortedTags.map(tag => ({ 
      ...tag, 
      size: maxCount === minCount ? 1 : 0.8 + ((tag.count - minCount) / (maxCount - minCount)) * 1.7 
    }));
  }, [allPhotos]);

  const filteredPhotos = useMemo(() => {
    if (!searchQuery && !selectedTag) return [];
    let results = allPhotos;
    if (selectedTag) results = results.filter(p => p.tags.includes(selectedTag));
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      results = results.filter(f => 
        f.caption.toLowerCase().includes(term) || 
        f.tags.some(t => t.toLowerCase().includes(term)) || 
        f.ubicacion.toLowerCase().includes(term)
      );
    }
    return results;
  }, [allPhotos, selectedTag, searchQuery]);

  const navigateLightbox = (direction: number) => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + direction + filteredPhotos.length) % filteredPhotos.length);
  };

  const handlePanEnd = (_e: any, info: PanInfo) => {
    if (info.offset.x < -50) navigateLightbox(1);
    else if (info.offset.x > 50) navigateLightbox(-1);
  };

  useEffect(() => {
    document.body.style.overflow = selectedPhotoIndex !== null ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPhotoIndex]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <Helmet><title>Explorar | Carlos González Saavedra</title></Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Archivo Visual</p>
          <h1 className="font-serif text-4xl md:text-6xl mb-6">Explorar</h1>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input 
              type="text"
              placeholder="Busca por lugar, etiqueta..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedTag(null); }}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-20">
          {tagCloud.map(tag => (
            <button key={tag.name} onClick={() => { setSelectedTag(selectedTag === tag.name ? null : tag.name); setSearchQuery(''); }}
              className={`transition-all hover:text-gold ${selectedTag === tag.name ? 'text-gold scale-110' : 'text-white/40'}`}
              style={{ fontSize: `${tag.size}rem` }}>
              {tag.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div key={index} layout className="cursor-zoom-in group" onClick={() => setSelectedPhotoIndex(index)}>
              <div className="aspect-square bg-white/5 overflow-hidden mb-2">
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" loading="lazy" />
              </div>
              <p className="text-white/60 text-[10px] italic line-clamp-2">{photo.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div className="fixed inset-0 z-[9999] bg-black/98 flex flex-col" onClick={() => setSelectedPhotoIndex(null)}>
            <div className="w-full px-6 py-4 md:px-10 flex justify-between items-center z-10">
              <div className="flex items-center gap-2"><Camera className="w-5 h-5 text-gold" /><span className="font-serif text-lg tracking-widest uppercase text-white hidden sm:inline">CGS</span></div>
              <button className="text-white/80 hover:text-gold p-3 bg-black/40 rounded-full border border-white/10 transition-all hover:rotate-90" onClick={() => setSelectedPhotoIndex(null)}><X size={24} /></button>
            </div>

            {/* Flechas de Navegación Desktop */}
            <button className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}><ChevronLeft size={56} strokeWidth={1} /></button>
            <button className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}><ChevronRight size={56} strokeWidth={1} /></button>

            <div className="flex-grow flex flex-col items-center justify-center p-4 overflow-hidden">
              <div className="relative w-full max-w-5xl flex flex-col items-center">
                <div className="w-full flex justify-between text-[10px] text-gold uppercase tracking-[0.5em] mb-4">
                  <span>{filteredPhotos[selectedPhotoIndex].ubicacion}</span>
                  <span className="text-white/40">{selectedPhotoIndex + 1} / {filteredPhotos.length}</span>
                </div>

                <motion.img 
                  key={filteredPhotos[selectedPhotoIndex].url}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onPanEnd={handlePanEnd}
                  src={filteredPhotos[selectedPhotoIndex].url} 
                  className="shadow-2xl object-contain w-full"
                  style={{ maxHeight: '60vh', touchAction: 'pan-y pinch-zoom' }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="mt-6 text-center w-full px-4">
                  <p className="font-cormorant text-lg md:text-xl text-white/80 italic mb-4 leading-relaxed">{filteredPhotos[selectedPhotoIndex].caption}</p>
                  {filteredPhotos[selectedPhotoIndex].tripId && (
                    <Link to={`/viaje/${filteredPhotos[selectedPhotoIndex].tripId}`} className="text-gold text-[10px] uppercase tracking-[0.4em] hover:text-white transition-colors">Leer crónica completa</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};
