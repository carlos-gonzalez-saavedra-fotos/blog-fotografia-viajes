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

  // Swipe handling
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      navigateLightbox(1); // siguiente
    } else if (swipe > swipeConfidenceThreshold) {
      navigateLightbox(-1); // anterior
    }
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

      {/* Lightbox - Clon exacto de PhotographySection */}
<AnimatePresence>
  {selectedPhotoIndex !== null && (
    <div 
      className="fixed inset-0 z-[9999] bg-black/98 flex flex-col"
      onClick={() => setSelectedPhotoIndex(null)}
    >
      {/* Barra de Navegación Superior (Logo y Cerrar) */}
      <div className="w-full px-6 py-4 md:px-10 md:py-6 flex justify-between items-center z-[10000] flex-shrink-0">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
        >
          <Camera className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
          <span className="font-serif text-lg tracking-widest uppercase text-white hidden sm:inline">CGS</span>
        </div>

        <button 
          className="text-white/80 hover:text-gold transition-all hover:rotate-90 p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10"
          onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
          aria-label="Cerrar galería"
        >
          <X size={32} className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Navegación lateral */}
      <button 
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
        onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
      >
        <ChevronLeft size={56} strokeWidth={1} />
      </button>
      <button 
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
        onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
      >
        <ChevronRight size={56} strokeWidth={1} />
      </button>

      {/* Imagen Principal y Numeración */}
      <div className="flex-grow w-full flex flex-col items-center justify-center pt-24 px-4 pb-24 md:px-24 overflow-hidden">
        {/* Usamos una lógica similar para el ancho, aunque en Explorar no tenemos isPortrait definido como estado, mantenemos el max-w-5xl */}
        <div className="relative flex flex-col items-center w-full max-w-5xl">
          
          {/* Header de Información (Ubicación + Contador) */}
          <div className="w-full flex justify-between items-center mb-6">
            <div className="text-left pr-8">
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold whitespace-nowrap">
                {filteredPhotos[selectedPhotoIndex].ubicacion}
              </h3>
            </div>
            <div className="text-right whitespace-nowrap">
              <span className="text-white/40 text-[10px] tracking-widest uppercase">
                {selectedPhotoIndex + 1} / {filteredPhotos.length}
              </span>
            </div>
          </div>

          {/* Contenedor de Imagen */}
          <div className="relative w-full flex justify-center">
            <motion.img 
              key={filteredPhotos[selectedPhotoIndex].url}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              src={filteredPhotos[selectedPhotoIndex].url} 
              alt={filteredPhotos[selectedPhotoIndex].caption}
              className="shadow-2xl object-contain w-full"
              style={{ maxHeight: '60vh' }}
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Leyenda con la tipografía exacta de la galería */}
          <div className="mt-6 text-center w-full px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={`caption-${selectedPhotoIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-cormorant font-normal text-lg md:text-xl text-white/80 mb-4 italic tracking-[0.05em] leading-relaxed"
              >
                {filteredPhotos[selectedPhotoIndex].caption}
              </motion.p>
            </AnimatePresence>

            {/* Enlace opcional si hay crónica */}
            {filteredPhotos[selectedPhotoIndex].tripId && (
              <Link 
                to={`/viaje/${filteredPhotos[selectedPhotoIndex].tripId}`}
                className="inline-block mt-2 text-[10px] uppercase tracking-[0.4em] text-gold hover:text-white transition-colors"
              >
                Leer crónica completa
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
</AnimatePresence>
      
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
};

