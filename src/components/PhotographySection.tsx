import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MIS_FOTOS, MIS_VIAJES } from '../data/mis_viajes';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const PhotographySection = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isPortrait, setIsPortrait] = React.useState(false);
  const location = useLocation();

  const allGalleries = React.useMemo(() => {
    const tripGalleries = MIS_VIAJES.filter(v => v.galeria && v.galeria.length > 0).map(v => ({
      id: v.id, url: v.urlImagen, titulo: v.titulo, ubicacion: v.ubicacion, galeriaTematica: v.galeria
    }));
    return [...MIS_FOTOS, ...tripGalleries];
  }, []);

  React.useEffect(() => { 
    setSelectedId(null); 
    setSubIndex(0); 
  }, [location]);

  React.useEffect(() => {
    document.body.style.overflow = selectedId ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  const selectedExpedition = allGalleries.find(p => p.id === selectedId);
  const currentGallery = React.useMemo(() => {
    if (!selectedExpedition) return [];
    return (selectedExpedition.galeriaTematica || [selectedExpedition.url]).map(item => 
      typeof item === 'string' ? { url: item, caption: '' } : item
    );
  }, [selectedExpedition]);

  const navigate = (direction: number) => {
    if (currentGallery.length <= 1) return;
    setSubIndex((prev) => (prev + direction + currentGallery.length) % currentGallery.length);
  };

  const handlePanEnd = (_e: any, info: PanInfo) => {
    if (info.offset.x < -50) navigate(1);
    else if (info.offset.x > 50) navigate(-1);
  };

  return (
    <section id="galeria" className="py-24 px-6 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Archivo visual</p>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Quietud contemplativa</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {allGalleries.map((photo) => (
            <motion.div 
              key={photo.id} 
              onClick={() => { setSelectedId(photo.id); setSubIndex(0); }} 
              className="relative group cursor-zoom-in overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <img 
                src={photo.url} 
                alt={photo.titulo} 
                className="w-full grayscale hover:grayscale-0 transition-all duration-700" 
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
        {selectedId && (
          <div className="fixed inset-0 z-[9999] bg-black/98 flex flex-col" onClick={() => setSelectedId(null)}>
            <div className="w-full px-6 py-4 md:px-10 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-gold" />
                <span className="font-serif text-lg uppercase text-white hidden sm:inline">CGS</span>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-white hover:text-gold p-3 transition-all hover:rotate-90">
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            {/* FLECHAS RESTAURADAS PARA DESKTOP */}
            {currentGallery.length > 1 && (
              <>
                <button 
                  className=\"hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-50 p-4 transition-all\" 
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                >
                  <ChevronLeft size={64} strokeWidth={1} />
                </button>
                <button 
                  className=\"hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-50 p-4 transition-all\" 
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                >
                  <ChevronRight size={64} strokeWidth={1} />
                </button>
              </>
            )}

            <div className="flex-grow flex items-center justify-center p-4 overflow-hidden">
              <div className={`relative flex flex-col items-center transition-all duration-500 ${isPortrait ? 'lg:max-w-[40%]' : 'w-full max-w-5xl'}`}>
                <div className="w-full flex justify-between text-[10px] text-gold uppercase tracking-[0.5em] mb-4 px-2">
                  <span>{selectedExpedition?.ubicacion}</span>
                  <span>{subIndex + 1} / {currentGallery.length}</span>
                </div>
                <motion.img 
                  key={currentGallery[subIndex].url}
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  onPanEnd={handlePanEnd}
                  src={currentGallery[subIndex].url} 
                  className="max-w-full shadow-2xl object-contain"
                  style={{ maxHeight: '70vh', touchAction: 'pan-y pinch-zoom' }}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    setIsPortrait(img.naturalHeight > img.naturalWidth);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="mt-6 font-cormorant text-xl text-white/80 italic text-center px-4 leading-relaxed">
                  {currentGallery[subIndex].caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
