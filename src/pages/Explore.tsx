import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { MIS_VIAJES, MIS_FOTOS } from '../data/mis_viajes';
import { Search } from 'lucide-react';
import { Lightbox } from '../components/ui/Lightbox';
import { Footer } from '../components/Footer';

interface PhotoItem {
  url: string;
  caption: string;
  tags: string[];
  ubicacion: string;
  titulo: string;
  tripId?: string;
  useTitleAsHeader?: boolean;
}

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allPhotos = useMemo(() => {
    const photos: PhotoItem[] = [];
    const seenUrls = new Set<string>();

    MIS_VIAJES.forEach(viaje => {
      if (viaje.galeria) {
        viaje.galeria.forEach(item => {
          const url = typeof item === 'string' ? item : item.url;
          if (seenUrls.has(url)) return;
          seenUrls.add(url);
          
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
          if (seenUrls.has(url)) return;
          seenUrls.add(url);

          const caption = typeof item === 'string' ? '' : item.caption || '';
          const tags = typeof item === 'string' ? [] : item.tags || [];
          photos.push({ 
            url, 
            caption, 
            tags, 
            ubicacion: foto.ubicacion, 
            titulo: foto.titulo,
            tripId: foto.id,
            useTitleAsHeader: true 
          });
        });
      }
    });
    return photos;
  }, []);

  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {};
    const originalNames: Record<string, string> = {}; // Para mantener la capitalización más frecuente

    allPhotos.forEach(photo => {
      photo.tags.forEach(tag => {
        const lowerTag = tag.toLowerCase().trim();
        if (!lowerTag) return;
        counts[lowerTag] = (counts[lowerTag] || 0) + 1;
        // Guardamos el nombre original para mostrarlo (preferimos el que tenga mayúsculas si existe)
        if (!originalNames[lowerTag] || (tag !== lowerTag && tag[0] === tag[0].toUpperCase())) {
          originalNames[lowerTag] = tag;
        }
      });
    });

    const sortedTags = Object.entries(counts)
      .map(([lowerName, count]) => ({ 
        name: originalNames[lowerName], 
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 60) // Aumentamos a 60 para que sea más rica
      .sort((a, b) => a.name.localeCompare(b.name)); // Orden alfabético para la nube

    const maxCount = Math.max(...sortedTags.map(t => t.count), 1);
    const minCount = Math.min(...sortedTags.map(t => t.count), 1);

    return sortedTags.map(tag => ({ 
      ...tag, 
      size: maxCount === minCount ? 1 : 0.8 + ((tag.count - minCount) / (maxCount - minCount)) * 1.5 
    }));
  }, [allPhotos]);

  const filteredPhotos = useMemo(() => {
    if (!searchQuery && !selectedTag) return [];
    let results = allPhotos;
    if (selectedTag) {
      const lowerSelected = selectedTag.toLowerCase();
      results = results.filter(p => p.tags.some(t => t.toLowerCase() === lowerSelected));
    }
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

  // Scroll suave a los resultados cuando hay búsqueda o tag seleccionado
  useEffect(() => {
    if (!searchQuery && !selectedTag) return;

    // Usamos un pequeño delay para la búsqueda para no interrumpir la escritura,
    // pero instantáneo para la selección de etiquetas.
    const delay = searchQuery ? 400 : 0;
    
    const timer = setTimeout(() => {
      if (resultsRef.current && filteredPhotos.length > 0) {
        const yOffset = -120; // Margen superior para que no quede pegado al borde
        const element = resultsRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, filteredPhotos.length]);

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
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 font-light">
      <Helmet><title>Explorar | Carlos González Saavedra</title></Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Archivo Visual</p>
          <h1 className="font-serif text-4xl md:text-6xl mb-6">Explorar</h1>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
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

        <div ref={resultsRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div key={index} layout className="cursor-zoom-in group" onClick={() => setSelectedPhotoIndex(index)}>
              <div className="aspect-square bg-white/5 overflow-hidden mb-2">
                <img 
                  src={photo.url} 
                  alt={photo.caption} 
                  width={300}
                  height={300}
                  loading="lazy" 
                  decoding="async"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <p className="text-white/60 text-[10px] italic line-clamp-2 leading-relaxed">{photo.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Unificado */}
      <Lightbox 
        isOpen={selectedPhotoIndex !== null}
        onClose={() => setSelectedPhotoIndex(null)}
        currentIndex={selectedPhotoIndex || 0}
        onIndexChange={(index) => setSelectedPhotoIndex(index)}
        photos={filteredPhotos.map(p => ({
          url: p.url,
          caption: p.caption,
          ubicacion: p.ubicacion,
          titulo: p.titulo,
          tripId: p.tripId,
          useTitleAsHeader: p.useTitleAsHeader
        }))}
      />
      <Footer />
    </div>
  );
};
