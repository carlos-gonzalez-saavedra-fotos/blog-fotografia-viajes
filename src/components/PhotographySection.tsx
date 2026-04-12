import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MIS_FOTOS, MIS_VIAJES } from '../data/mis_viajes';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const PhotographySection = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isPortrait, setIsPortrait] = React.useState(false);
  const [dragEnabled, setDragEnabled] = React.useState(true);
  const location = useLocation();

  const allGalleries = React.useMemo(() => {
    const tripGalleries = MIS_VIAJES
      .filter(v => v.galeria && v.galeria.length > 0)
      .map(v => ({
        id: v.id,
        url: v.urlImagen,
        titulo: v.titulo,
        ubicacion: v.ubicacion,
        equipo: v.equipo,
        galeriaTematica: v.galeria
      }));
    
    return [...MIS_FOTOS, ...tripGalleries];
  }, []);

  React.useEffect(() => {
    setSelectedId(null);
    setSubIndex(0);
    setIsPortrait(false);
  }, [location]);

  React.useEffect(() => {
    setIsPortrait(false);
  }, [subIndex]);

  React.useEffect(() => {
    if (selectedId) {
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
  }, [selectedId]);

  const selectedExpedition = React.useMemo(() => 
    allGalleries.find(p => p.id === selectedId), 
  [selectedId, allGalleries]);

  const currentGallery = React.useMemo(() => {
    if (!selectedExpedition) return [];
    const items = selectedExpedition.galeriaTematica || [selectedExpedition.url];
    return items.map(item => typeof item === 'string' ? { url: item, caption: '' } : item);
  }, [selectedExpedition]);

  const navigate = (direction: number) => {
    if (currentGallery.length <= 1) return;
    setSubIndex((prev) => (prev + direction + currentGallery.length) % currentGallery.length);
  };

  // Swipe handling
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      navigate(1); // siguiente
    } else if (swipe > swipeConfidenceThreshold) {
      navigate(-1); // anterior
    }
  };

  // Detectar pinch-to-zoom (2+ dedos) para deshabilitar drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      setDragEnabled(false);
    } else {
      setDragEnabled(true);
    }
  };

  const handleTouchEnd = () => {
    setDragEnabled(true);
  };

  return (
    <section id="galeria" className="py-24 px-6 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Archivo visual</p>
          <h2 className="font-serif text-4xl md:text-6xl mb-6 text-white">Quietud contemplativa</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {allGalleries.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={() => {
                setSelectedId(photo.id);
                setSubIndex(0);
              }}
              className="relative group overflow-hidden cursor-zoom-in bg-white/5"
            >
              <img 
                src={photo.url} 
                alt={photo.titulo}
                loading="lazy"
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="text-gold text-[10px] uppercase tracking-widest">{photo.ubicacion}</p>
                <h4 className="font-serif text-lg text-white">{photo.titulo}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && selectedExpedition && (
          <div 
            className="fixed inset-0 z-[9999] bg-black/98 flex flex-col"
            onClick={() => setSelectedId(null)}
          >
            {/* Barra de Navegación Superior (Logo y Cerrar) */}
            <div className="w-full px-6 py-4 md:px-10 md:py-6 flex justify-between items-center z-[10000] flex-shrink-0">
              {/* Izquierda: Logo */}
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
              >
                <Camera className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <span className="font-serif text-lg tracking-widest uppercase text-white hidden sm:inline">CGS</span>
              </div>

              {/* Derecha: Cerrar */}
              <button 
                className="text-white/80 hover:text-gold transition-all hover:rotate-90 p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10"
                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                aria-label="Cerrar galería"
              >
                <X size={32} className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Navegación - SOLO VISIBLE EN DESKTOP */}
            {currentGallery.length > 1 && (
              <>
                <button 
                  className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={56} strokeWidth={1} />
                </button>
                <button 
                  className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                  aria-label="Foto siguiente"
                >
                  <ChevronRight size={56} strokeWidth={1} />
                </button>
              </>
            )}

            {/* Imagen Principal y Numeración */}
            <div className="flex-grow w-full flex flex-col items-center justify-center pt-24 px-4 pb-24 md:px-24 overflow-hidden">
              <div className={`relative flex flex-col items-center transition-all duration-500 ${isPortrait ? 'lg:max-w-[45%]' : 'w-full max-w-5xl'}`}>
                {/* Header de Información (Ubicación + Contador) */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="text-left pr-8">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold whitespace-nowrap">
                      {selectedExpedition.ubicacion}
                    </h3>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-white/40 text-[10px] tracking-widest uppercase">
                      {subIndex + 1} / {currentGallery.length}
                    </span>
                  </div>
                </div>

                <div className="relative w-full flex justify-center touch-pan-y">
                  <motion.img 
                    key={currentGallery[subIndex].url}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    drag={dragEnabled ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    src={currentGallery[subIndex].url} 
                    alt={currentGallery[subIndex].caption || selectedExpedition.titulo}
                    className="shadow-2xl object-contain w-full"
                    style={{ 
                      maxHeight: '60vh',
                      touchAction: dragEnabled ? 'pan-y' : 'auto'
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
                    {currentGallery[subIndex].caption && (
                      <motion.p
                        key={`caption-${subIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="font-cormorant font-normal text-lg md:text-xl text-white/80 mb-4 italic tracking-[0.05em] leading-relaxed"
                      >
                        {currentGallery[subIndex].caption}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
