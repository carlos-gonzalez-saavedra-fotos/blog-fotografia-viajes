import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  // Flatten all photos from all sources
  const allPhotos = useMemo(() => {
    const photos: PhotoItem[] = [];

    // From MIS_VIAJES
    MIS_VIAJES.forEach(viaje => {
      if (viaje.galeria) {
        viaje.galeria.forEach(item => {
          const url = typeof item === 'string' ? item : item.url;
          const caption = typeof item === 'string' ? '' : item.caption || '';
          const tags = typeof item === 'string' ? [] : item.tags || [];
          
          photos.push({
            url,
            caption,
            tags,
            ubicacion: viaje.ubicacion,
            titulo: viaje.titulo,
            tripId: viaje.id
          });
        });
      }
    });

    // From MIS_FOTOS
    MIS_FOTOS.forEach(foto => {
      if (foto.galeriaTematica) {
        foto.galeriaTematica.forEach(item => {
          const url = typeof item === 'string' ? item : item.url;
          const caption = typeof item === 'string' ? '' : item.caption || '';
          const tags = typeof item === 'string' ? [] : item.tags || [];

          photos.push({
            url,
            caption,
            tags,
            ubicacion: foto.ubicacion,
            titulo: foto.titulo
          });
        });
      }
    });

    return photos;
  }, []);

  // Calculate tag frequencies
  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {};
    allPhotos.forEach(photo => {
      photo.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 40);

    const maxCount = Math.max(...sortedTags.map(t => t.count), 1);
    const minCount = Math.min(...sortedTags.map(t => t.count), 1);

    return sortedTags.map(tag => {
      // Calculate relative size (between 0.8rem and 2.5rem)
      const size = maxCount === minCount 
        ? 1 
        : 0.8 + ((tag.count - minCount) / (maxCount - minCount)) * 1.7;
      return { ...tag, size };
    });
  }, [allPhotos]);

  // Filtered results
  const filteredPhotos = useMemo(() => {
    // --- ESTE ES EL CAMBIO "ESTILO GOOGLE" ---
    // Si no hay texto en la búsqueda Y no hay un tag seleccionado, 
    // devolvemos un array vacío [] para que no cargue nada.
    if (!searchQuery && !selectedTag) {
      return [];
    }
    // -----------------------------------------

    let results = allPhotos;

    if (selectedTag) {
      results = results.filter(p => p.tags.includes(selectedTag));
    }

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const regex = new RegExp('\\b' + searchQuery + '\\b', 'i');
      
      results = results.filter(f => {
        const matchCaption = regex.test(f.caption);
        const matchTags = f.tags.some(t => t.toLowerCase().includes(term));
        const matchLugar = f.lugar?.toLowerCase().includes(term) || f.ubicacion?.toLowerCase().includes(term);
        const matchPais = f.pais?.toLowerCase().includes(term);
        const matchTitulo = f.titulo?.toLowerCase().includes(term);
        const matchTipo = f.tipo?.toLowerCase().includes(term);
        
        return matchCaption || matchTags || matchLugar || matchPais || matchTitulo || matchTipo;
      });
    }

    return results;
  }, [allPhotos, selectedTag, searchQuery]);

  // Lightbox navigation
  const navigateLightbox = (direction: number) => {
    if (selectedPhotoIndex === null) return;
    const nextIndex = (selectedPhotoIndex + direction + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhotoIndex(nextIndex);
  };

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPhotoIndex]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <Helmet>
        <title>Explorar | Carlos González Saavedra</title>
        <meta name="description" content="Explora el archivo fotográfico de Carlos González Saavedra a través de etiquetas y búsqueda libre." />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Archivo Visual</p>
          <h1 className="font-serif text-4xl md:text-6xl mb-6">Explorar</h1>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Busca por lugar, país, etiqueta o descripción..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                setSelectedTag(null); // Clear tag filter when searching
                if (value.length >= 3) {
                  setTimeout(() => {
                    const el = document.getElementById('results');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Tag Cloud */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <TagIcon size={16} className="text-gold" />
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/60">Nube de etiquetas</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 max-w-5xl mx-auto">
            {tagCloud.map(tag => (
              <button
                key={tag.name}
                onClick={() => {
                  const newTag = selectedTag === tag.name ? null : tag.name;
                  setSelectedTag(newTag);
                  setSearchQuery(''); // Clear search when selecting tag
                  if (newTag) {
                    setTimeout(() => {
                      const el = document.getElementById('results');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }}
                title={`${tag.count} fotos`}
                className={`transition-all duration-300 hover:text-gold ${
                  selectedTag === tag.name ? 'text-gold scale-110' : 'text-white/40'
                }`}
                style={{ fontSize: `${tag.size}rem` }}
              >
                {tag.name}
                <span className="text-[10px] ml-1 opacity-0 hover:opacity-100 transition-opacity align-top">
                  ({tag.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div id="results" className="space-y-12">
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              {filteredPhotos.length} resultados {selectedTag ? `para "${selectedTag}"` : searchQuery ? `para "${searchQuery}"` : ''}
            </p>
            {(selectedTag || searchQuery) && (
              <button 
                onClick={() => { setSelectedTag(null); setSearchQuery(''); }}
                className="text-[10px] uppercase tracking-widest text-gold hover:text-white transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={`${photo.url}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-zoom-in"
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <div className="aspect-square bg-white/5 overflow-hidden mb-2">
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-white/60 text-[10px] font-light leading-tight line-clamp-2 italic group-hover:text-gold transition-colors">
                    {photo.caption}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/40 font-light italic">No se encontraron imágenes que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox - Ajustado para coherencia visual */}
<AnimatePresence>
  {selectedPhotoIndex !== null && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/98 flex flex-col"
      onClick={() => setSelectedPhotoIndex(null)}
    >
      {/* Cabecera del Lightbox */}
      <div className="w-full px-6 py-4 flex justify-between items-center z-[10000]">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-gold" />
          <span className="font-serif text-lg tracking-widest uppercase text-white">CGS</span>
        </div>
        <button 
          className="text-white/80 hover:text-gold transition-all p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-grow relative flex items-center justify-center p-4 md:p-12">
        {/* Navegación lateral */}
        <button 
          className="absolute left-4 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
          onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        
        <div className="max-w-4xl w-full flex flex-col items-center">
          {/* Metadata superior: Ubicación y Contador */}
          <div className="w-full flex justify-between items-center mb-4 px-2">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em]">
              {filteredPhotos[selectedPhotoIndex].ubicacion}
            </span>
            <span className="text-white/40 text-[10px] tracking-widest">
              {selectedPhotoIndex + 1} / {filteredPhotos.length}
            </span>
          </div>
          
          {/* Imagen con tamaño controlado para dejar espacio al texto */}
          <motion.img 
            key={filteredPhotos[selectedPhotoIndex].url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={filteredPhotos[selectedPhotoIndex].url} 
            alt={filteredPhotos[selectedPhotoIndex].caption}
            className="max-h-[65vh] md:max-h-[70vh] object-contain shadow-2xl"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />

          {/* PIE DE FOTO (Caption): Ahora siempre visible como en las crónicas */}
          <div className="mt-8 text-center max-w-2xl px-4">
            <p className="font-serif text-lg md:text-xl text-white/90 italic leading-relaxed">
              {filteredPhotos[selectedPhotoIndex].caption}
            </p>
            
            {/* Enlace dinámico a la crónica si existe el tripId */}
            {filteredPhotos[selectedPhotoIndex].tripId && (
              <Link 
                to={`/viaje/${filteredPhotos[selectedPhotoIndex].tripId}`}
                className="inline-block mt-6 text-[10px] uppercase tracking-[0.4em] text-gold hover:text-white transition-colors border-b border-gold/20 pb-1"
              >
                Leer crónica completa
              </Link>
            )}
          </div>
        </div>

        <button 
          className="absolute right-4 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
          onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
        >
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
};
