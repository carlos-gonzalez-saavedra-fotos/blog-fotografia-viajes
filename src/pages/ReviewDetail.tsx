import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MIS_VIAJES } from '../data/mis_viajes';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowLeft, Quote, X, Search, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const viaje = MIS_VIAJES.find(v => v.id === id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(null);
    setIsPortrait(false);
  }, [location]);

  useEffect(() => {
    setIsPortrait(false);
  }, [selectedIndex]);

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

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('gallery-active');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('gallery-active');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('gallery-active');
    };
  }, [selectedIndex]);

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
      <Helmet>
        <title>{`${viaje.titulo} | Carlos González Saavedra`}</title>
        <meta name="description" content={viaje.resumen} />
        <meta property="og:title" content={`${viaje.titulo} | Carlos González Saavedra`} />
        <meta property="og:description" content={viaje.resumen} />
        <meta property="og:image" content={viaje.urlImagen} />
        <meta property="twitter:title" content={`${viaje.titulo} | Carlos González Saavedra`} />
        <meta property="twitter:description" content={viaje.resumen} />
        <meta property="twitter:image" content={viaje.urlImagen} />
      </Helmet>

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
                    {viaje.galeria.slice(0, 6).map((item, index) => {
                      const imgUrl = typeof item === 'string' ? item : item.url;
                      const caption = typeof item === 'string' ? '' : item.caption;
                      const isLastVisible = index === 5 && viaje.galeria!.length > 6;
                      
                      return (
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
                            src={imgUrl} 
                            alt={caption || `${viaje.titulo} - ${index + 1}`}
                            className={`w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 ${isLastVisible ? 'blur-[2px]' : ''}`}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {isLastVisible ? (
                              <div className="text-center">
                                <span className="block text-gold text-2xl font-serif">+{viaje.galeria!.length - 6}</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/80">Ver todas</span>
                              </div>
                            ) : (
                              <Search className="text-white w-6 h-6" />
                            )}
                          </div>
                          {isLastVisible && (
                            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                          )}
                        </motion.div>
                      );
                    })}
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
            className="fixed inset-0 z-[10000] bg-black/98 flex flex-col"
          >
            {/* Barra de Navegación Superior (Logo y Cerrar) */}
            <div className="w-full px-6 py-4 md:px-10 md:py-6 flex justify-between items-center z-[10000] flex-shrink-0">
              {/* Izquierda: Logo */}
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
              >
                <Camera className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <span className="font-serif text-lg tracking-widest uppercase text-white hidden sm:inline">CGS</span>
              </div>

              {/* Derecha: Cerrar */}
              <button 
                className="text-white/80 hover:text-gold transition-all hover:rotate-90 p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10"
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
                aria-label="Cerrar galería"
              >
                <X size={32} className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Navegación */}
            {viaje.galeria.length > 1 && (
              <>
                <button 
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedIndex((prev) => (prev! - 1 + viaje.galeria!.length) % viaje.galeria!.length); 
                  }}
                >
                  <ChevronLeft size={56} strokeWidth={1} />
                </button>

                <button 
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedIndex((prev) => (prev! + 1) % viaje.galeria!.length); 
                  }}
                >
                  <ChevronRight size={56} strokeWidth={1} />
                </button>
              </>
            )}

            {/* Imagen Principal y Numeración */}
            <div className="flex-grow w-full flex flex-col items-center justify-center pt-24 px-4 pb-24 md:px-24 overflow-hidden">
              <div className={`relative flex flex-col items-center transition-all duration-500 ${isPortrait ? 'lg:max-w-[45%]' : 'w-full max-w-5xl'}`}>
                {/* Header de Información (Ubicación + Contador) */}
                <div className="w-full flex justify-between items-end mb-6 border-b border-white/5 pb-2">
                  <div className="text-left pr-8">
                    <div className="text-white/60 text-[9px] md:text-[10px] uppercase tracking-[0.4em] leading-tight">
                      <span className="block text-gold">{viaje.ubicacion}</span>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-gold font-normal text-[10px] md:text-xs tracking-[0.5em] uppercase opacity-80">
                      {selectedIndex! + 1} / {viaje.galeria.length}
                    </span>
                  </div>
                </div>

                <div className="relative w-full flex justify-center">
                  <motion.img
                    key={selectedIndex}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={typeof viaje.galeria[selectedIndex!] === 'string' 
                      ? viaje.galeria[selectedIndex!] as string 
                      : (viaje.galeria[selectedIndex!] as {url: string}).url}
                    alt="Full screen view"
                    className="shadow-2xl object-contain w-full"
                    style={{ 
                      maxHeight: '60vh'
                    }}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      setIsPortrait(img.naturalHeight > img.naturalWidth);
                    }}
                    referrerPolicy="no-referrer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                {/* Leyenda */}
                <div className="mt-6 text-center w-full px-4">
                  <AnimatePresence mode="wait">
                    {typeof viaje.galeria[selectedIndex!] !== 'string' && (viaje.galeria[selectedIndex!] as {caption: string}).caption && (
                      <motion.p 
                        key={`caption-${selectedIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="font-cormorant font-normal text-lg md:text-xl text-white/80 mb-4 italic tracking-[0.05em] leading-relaxed"
                      >
                        {(viaje.galeria[selectedIndex!] as {caption: string}).caption}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="border-t border-white/5 py-24 px-6 text-center">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] mb-8">Siguiente Aventura</p>
        <Link to="/#viajes" className="font-serif text-3xl md:text-5xl hover:text-gold transition-colors">
          Explorar más crónicas
        </Link>
      </div>
    </motion.div>
  );
};
