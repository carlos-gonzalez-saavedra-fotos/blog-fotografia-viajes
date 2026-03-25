import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MIS_FOTOS } from '../data/mis_viajes';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const PhotographySection = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [subIndex, setSubIndex] = React.useState(0);
  const location = useLocation();

  React.useEffect(() => {
    setSelectedId(null);
    setSubIndex(0);
  }, [location]);

  React.useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedId]);

  const selectedExpedition = React.useMemo(() => 
    MIS_FOTOS.find(p => p.id === selectedId), 
  [selectedId]);

  const currentGallery = React.useMemo(() => {
    if (!selectedExpedition) return [];
    return selectedExpedition.galeriaTematica || [selectedExpedition.url];
  }, [selectedExpedition]);

  const navigate = (direction: number) => {
    if (currentGallery.length <= 1) return;
    setSubIndex((prev) => (prev + direction + currentGallery.length) % currentGallery.length);
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
          {MIS_FOTOS.map((photo) => (
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
            className="fixed inset-0 z-[2000] bg-black/98 flex flex-col items-center justify-center"
            onClick={() => setSelectedId(null)}
          >
            {/* Header del Lightbox */}
            <div className="absolute top-0 left-0 w-full p-6 md:p-10 grid grid-cols-3 items-center z-[1010] bg-gradient-to-b from-black/80 to-transparent">
              {/* Izquierda: Logo/Cierre alternativo */}
              <div 
                className="flex items-center gap-2 cursor-pointer group w-fit"
                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
              >
                <Camera className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <span className="font-serif text-lg tracking-widest uppercase text-white hidden sm:inline">CGS</span>
              </div>

              {/* Centro: Info de la Galería */}
              <div className="text-center">
                <div className="text-white/60 text-[9px] md:text-[10px] uppercase tracking-[0.4em] leading-tight">
                  <span className="block text-gold/80 mb-1">{selectedExpedition.ubicacion}</span>
                  <span className="font-serif text-sm md:text-base text-white tracking-normal normal-case block mb-1">{selectedExpedition.titulo}</span>
                  <span className="opacity-50">{subIndex + 1} / {currentGallery.length}</span>
                </div>
              </div>

              {/* Derecha: Botón Cerrar principal */}
              <div className="flex justify-end">
                <button 
                  className="text-white/40 hover:text-gold transition-all hover:rotate-90 p-2"
                  onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                  aria-label="Cerrar galería"
                >
                  <X size={32} className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </div>

            {/* Navegación */}
            {currentGallery.length > 1 && (
              <>
                <button 
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[1010] p-4 transition-all"
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                >
                  <ChevronLeft size={56} strokeWidth={1} />
                </button>
                <button 
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[1010] p-4 transition-all"
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                >
                  <ChevronRight size={56} strokeWidth={1} />
                </button>
              </>
            )}

            {/* Imagen Principal - Sin forzar tamaños que rompan la resolución */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-24">
              <motion.img 
                key={currentGallery[subIndex]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={currentGallery[subIndex]} 
                alt={selectedExpedition.titulo}
                className="shadow-2xl max-w-full max-h-full object-contain"
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '75vh'
                }}
                referrerPolicy="no-referrer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* El pie de foto se ha movido al header para evitar redundancia */}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
