import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MIS_VIAJES } from '../data/mis_viajes';
import { MapPin, ArrowRight, BookOpen, Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const BlogSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const categories = useMemo(() => {
    const cats = new Set(MIS_VIAJES.map(v => v.categoria));
    return ['Todos', ...Array.from(cats)].sort();
  }, []);

  const filteredViajes = useMemo(() => {
    const filtered = activeCategory === 'Todos' 
      ? MIS_VIAJES 
      : MIS_VIAJES.filter(v => v.categoria === activeCategory);
    return filtered;
  }, [activeCategory]);

  const displayedViajes = filteredViajes.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <section id="viajes" className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div>
            <p className="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Crónicas</p>
            <h2 className="font-serif text-4xl md:text-6xl mb-4">Sendas y relatos</h2>
            <p className="text-white/50 max-w-md uppercase text-[10px] tracking-[0.2em]">
              Caminos transformados en recuerdos a través de {MIS_VIAJES.length} reseñas detalladas.
            </p>
          </div>

          {/* Filtros de Categoría */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat 
                    ? 'bg-gold text-black border-gold' 
                    : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Reseñas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {displayedViajes.map((viaje, i) => (
              <motion.article
                key={viaje.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, delay: (i % ITEMS_PER_PAGE) * 0.04 }}
                className="group bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all duration-500 flex flex-col h-full"
              >
                {/* Imagen */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={viaje.urlImagen} 
                    alt={viaje.titulo}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={400}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10">
                    <span className="text-gold text-[8px] uppercase tracking-widest">{viaje.categoria}</span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-8 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase tracking-widest">
                    <MapPin size={12} />
                    {viaje.ubicacion}
                  </div>
                  
                  <h3 className="font-serif text-2xl leading-tight group-hover:text-gold transition-colors line-clamp-2">
                    {viaje.titulo}
                  </h3>

                  <p className="text-white/50 leading-relaxed text-sm font-light line-clamp-3 flex-grow">
                    {viaje.resumen}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex gap-4">
                      <Link 
                        to={`/viaje/${viaje.id}`}
                        className="group/link flex items-center gap-2 text-[9px] uppercase tracking-widest text-gold hover:text-white transition-colors"
                      >
                        Ver reseña
                        <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>

                      {(viaje.galeria && viaje.galeria.length > 0) && (
                        <Link 
                          to={`/viaje/${viaje.id}#galeria`}
                          className="group/link flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/40 hover:text-gold transition-colors"
                        >
                          Ver Galería
                        </Link>
                      )}
                    </div>
                    
                    <Link 
                      to={`/viaje/${viaje.id}`}
                      className="text-white/20 hover:text-gold transition-colors"
                    >
                      <BookOpen size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Botón Cargar Más */}
        {visibleCount < filteredViajes.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-12 py-4 border border-white/10 text-[10px] uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all duration-500"
            >
              Cargar más reseñas
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredViajes.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/30 font-serif italic text-xl">No se encontraron viajes en esta categoría.</p>
          </div>
        )}
      </div>
    </section>
  );
};
