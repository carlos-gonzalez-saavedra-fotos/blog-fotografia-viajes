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
  lugar?: string;
  pais?: string;
  tipo?: string;
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
    return sortedTags.map(tag => ({ ...tag, size: maxCount === minCount ? 1 : 0.8 + ((tag.count - minCount) / (maxCount - minCount)) * 1.7 }));
  }, [allPhotos]);

  const filteredPhotos = useMemo(() => {
    if (!searchQuery && !selectedTag) return [];
    let results = allPhotos;
    if (selectedTag) results = results.filter(p => p.tags.includes(selectedTag));
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const regex = new RegExp('\\b' + term + '\\b', 'i');
      results = results.filter(f => regex.test(f.caption) || f.tags.some(t => t.toLowerCase().includes(term)) || f.ubicacion?.toLowerCase().includes(term) || f.titulo?.toLowerCase().includes(term));
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
      <Helmet>
        <title>Explorar | Carlos González Saavedra</title>
      </Helmet>

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
              placeholder="Busca por lugar, país, etiqueta..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedTag(null); }}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-20">
          {tagCloud.map(tag => (
            <button key={tag.name} onClick={() => { setSelectedTag(selectedTag === tag.name ? null : tag.name); setSearchQuery(''); }}
              className={`transition-all ${selectedTag === tag.name ? 'text-gold scale-110' : 'text-white/40'}`}
              style={{ fontSize: `${tag.size}rem` }}>
              {tag.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div key={index} layout className="cursor-zoom-in" onClick={() => setSelectedPhotoIndex(index)}>
              <div className="aspect-square bg-white/5 overflow-hidden mb-2">
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" loading="lazy" />
              </div>
              <p className="text-white/60 text-[10px] italic line-clamp-2">{photo.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div className="fixed inset-0 z-[9999] bg-black/98 flex flex-col" onClick={() => setSelectedPhotoIndex(null)}>
            <div className="w-full px-6 py-4 flex justify-between items-center z-10">
              <Camera className="w-5 h-5 text-gold" />
              <button className="text-white hover:text-gold p-2" onClick={() => setSelectedPhotoIndex(null)}><X size={32} /></button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center p-4 overflow-auto">
              <div className="relative w-full max-w-5xl flex flex-col items-center">
                <div className="w-full flex justify-between text-[10px] text-gold uppercase tracking-widest mb-4">
                  <span>{filteredPhotos[selectedPhotoIndex].ubicacion}</span>
                  <span className="text-white/40">{selectedPhotoIndex + 1} / {filteredPhotos.length}</span>
                </div>

                <motion.img 
                  key={filteredPhotos[selectedPhotoIndex].url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onPanEnd={handlePanEnd}
                  src={filteredPhotos[selectedPhotoIndex].url} 
                  className="shadow-2xl object-contain max-w-full"
                  style={{ maxHeight: '70vh', touchAction: 'pan-y pinch-zoom' }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="mt-6 text-center">
                  <p className="font-cormorant text-lg text-white/80 italic">{filteredPhotos[selectedPhotoIndex].caption}</p>
                  {filteredPhotos[selectedPhotoIndex].tripId && (
                    <Link to={`/viaje/${filteredPhotos[selectedPhotoIndex].tripId}`} className="text-gold text-[10px] uppercase tracking-widest mt-4 inline-block">Ver crónica</Link>
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
