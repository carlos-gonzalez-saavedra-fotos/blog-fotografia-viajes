import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MIS_FOTOS, MIS_VIAJES } from '../data/mis_viajes';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const PhotographySection = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [subIndex, setSubIndex] = React.useState(0);
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
  }, [location]);

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
            {/* Header del Lightbox */}
            <div className="w-full p-6 md:p-10 grid grid-cols-3 items-center z-[10000]">
              {/* Izquierda: Logo que también cierra */}
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
                  <span className="block text-gold/80">{selectedExpedition.ubicacion}</span>
                </div>
              </div>

              {/* Derecha: Botón Cerrar principal */}
              <div className="flex justify-end">
                <button 
                  className="text-white/80 hover:text-gold transition-all hover:rotate-90 p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10"
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
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                >
                  <ChevronLeft size={56} strokeWidth={1} />
                </button>
                <button 
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all"
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                >
                  <ChevronRight size={56} strokeWidth={1} />
                </button>
              </>
            )}

            {/* Imagen Principal y Numeración */}
            <div className="flex-grow w-full flex flex-col items-center justify-center p-4 md:px-24 md:pb-12 overflow-y-auto">
              <div className="relative flex flex-col items-center min-h-min">
                <motion.img 
                  key={currentGallery[subIndex].url}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={currentGallery[subIndex].url} 
                  alt={currentGallery[subIndex].caption || selectedExpedition.titulo}
                  className="shadow-2xl object-contain"
                  style={{ 
                    maxWidth: '95vw', 
                    maxHeight: '65vh'
                  }}
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Leyenda y Numeración */}
                <div className="mt-8 text-center max-w-2xl px-6 pb-8">
                  <AnimatePresence mode="wait">
                    {currentGallery[subIndex].caption && (
                      <motion.p
                        key={`caption-${subIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="font-cormorant font-normal text-lg md:text-xl text-white/80 mb-4 italic tracking-[0.05em]"
                      >
                        {currentGallery[subIndex].caption}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gold font-normal text-[10px] md:text-xs tracking-[0.5em] uppercase"
                  >
                    {subIndex + 1} / {currentGallery.length}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* El pie de foto se ha movido al header para evitar redundancia */}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
