import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { MIS_VIAJES } from '../data/mis_viajes';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowLeft, Quote, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const viaje = MIS_VIAJES.find(v => v.id === id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(null);
  }, [location]);

  useEffect(() => {
    if (window.location.hash === '#galeria') {
      setTimeout(() => {
        scrollToGallery();
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [id]);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!viaje) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <h1 className="font-serif text-4xl mb-8">Reseña no encontrada</h1>
        <Link to="/" className="text-gold uppercase tracking-widest text-xs border border-gold px-6 py-3 hover:bg-gold hover:text-black transition-all">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white"
    >
      {/* Hero Header */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={viaje.urlImagen} 
          alt={viaje.titulo}
          className="w-full h-full object-cover grayscale opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl space-y-6"
          >
            <div className="flex items-center justify-center gap-2 text-gold text-[10px] uppercase tracking-[0.4em]">
              <MapPin size={14} />
              {viaje.ubicacion}
            </div>
            <h1 className="font-serif text-5xl md:text-8xl leading-tight">
              {viaje.titulo}
            </h1>
          </motion.div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 md:left-12 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-gold transition-colors z-50"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gold">Fecha</p>
              <p className="text-sm font-light text-white/60">{viaje.fecha || 'Pendiente'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gold">Equipo</p>
              <p className="text-sm font-light text-white/60">{viaje.equipo || 'Pendiente'}</p>
            </div>
            <div className="pt-8">
              <button 
                onClick={scrollToGallery}
                className="w-full py-4 border border-white/10 text-[10px] uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
              >
                Ver Galería
              </button>
            </div>
          </div>

            {/* Review Text */}
            <div className="md:col-span-3 space-y-12">
              <div className="relative">
                <Quote className="absolute -left-12 -top-8 text-white/5 w-24 h-24 -z-10" />
                <div className="prose prose-invert prose-lg max-w-none">
                  {viaje.reseña.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="text-white/80 leading-relaxed font-light mb-6 text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Gallery Section */}
              {viaje.galeria && viaje.galeria.length > 0 && (
                <div ref={galleryRef} className="pt-12 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-grow bg-white/10" />
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold whitespace-nowrap">Fragmentos Visuales</h3>
                    <div className="h-[1px] flex-grow bg-white/10" />
                  </div>
                  
                  <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {viaje.galeria.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="break-inside-avoid overflow-hidden border border-white/5 group relative cursor-zoom-in"
                        onClick={() => setSelectedIndex(index)}
                      >
                        <img 
                          src={img} 
                          alt={`${viaje.titulo} - ${index + 1}`}
                          className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Search className="text-white w-6 h-6" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && viaje.galeria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedIndex(null)}
              className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            {viaje.galeria.length > 1 && (
              <>
                <button 
                  className="absolute left-4 md:left-8 text-white/30 hover:text-gold transition-colors z-[110]"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedIndex((prev) => (prev! - 1 + viaje.galeria!.length) % viaje.galeria!.length); 
                  }}
                >
                  <ChevronLeft size={48} strokeWidth={1} />
                </button>

                <button 
                  className="absolute right-4 md:right-8 text-white/30 hover:text-gold transition-colors z-[110]"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedIndex((prev) => (prev! + 1) % viaje.galeria!.length); 
                  }}
                >
                  <ChevronRight size={48} strokeWidth={1} />
                </button>
              </>
            )}

            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={viaje.galeria[selectedIndex]}
                alt="Full screen view"
                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 text-white/40 text-[10px] uppercase tracking-widest">
                {selectedIndex + 1} / {viaje.galeria.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="border-t border-white/5 py-24 px-6 text-center">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] mb-8">Siguiente Aventura</p>
        <Link to="/" className="font-serif text-3xl md:text-5xl hover:text-gold transition-colors">
          Explorar más crónicas
        </Link>
      </div>
    </motion.div>
  );
};
