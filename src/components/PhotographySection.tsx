import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MIS_FOTOS, MIS_VIAJES } from '../data/mis_viajes';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const PhotographySection = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [subIndex, setSubIndex] = React.useState(0);
  const location = useLocation();

  const allGalleries = React.useMemo(() => {
    const tripGalleries = MIS_VIAJES.filter(v => v.galeria && v.galeria.length > 0).map(v => ({
      id: v.id, url: v.urlImagen, titulo: v.titulo, ubicacion: v.ubicacion, galeriaTematica: v.galeria
    }));
    return [...MIS_FOTOS, ...tripGalleries];
  }, []);

  React.useEffect(() => { setSelectedId(null); setSubIndex(0); }, [location]);

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

  const navigate = (dir: number) => setSubIndex((subIndex + dir + currentGallery.length) % currentGallery.length);

  const handlePanEnd = (_e: any, info: PanInfo) => {
    if (info.offset.x < -50) navigate(1);
    else if (info.offset.x > 50) navigate(-1);
  };

  return (
    <section id="galeria" className="py-24 px-6 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Quietud contemplativa</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        <div className="columns-1 md:columns-3 gap-8 space-y-8">
          {allGalleries.map((photo) => (
            <div key={photo.id} onClick={() => { setSelectedId(photo.id); setSubIndex(0); }} className="relative group cursor-zoom-in">
              <img src={photo.url} alt={photo.titulo} className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[9999] bg-black/98 flex flex-col" onClick={() => setSelectedId(null)}>
            <div className="w-full px-6 py-4 flex justify-between items-center z-10">
              <Camera className="w-5 h-5 text-gold" />
              <button onClick={() => setSelectedId(null)} className="text-white"><X size={32} /></button>
            </div>

            <div className="flex-grow flex items-center justify-center p-4 overflow-auto">
              <div className="w-full max-w-5xl flex flex-col items-center">
                <div className="w-full flex justify-between text-[10px] text-gold uppercase mb-4">
                  <span>{selectedExpedition?.ubicacion}</span>
                  <span>{subIndex + 1} / {currentGallery.length}</span>
                </div>
                <motion.img 
                  key={currentGallery[subIndex].url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onPanEnd={handlePanEnd}
                  src={currentGallery[subIndex].url} 
                  className="max-w-full shadow-2xl"
                  style={{ maxHeight: '70vh', touchAction: 'pan-y pinch-zoom' }}
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="mt-6 font-cormorant text-xl text-white/80 italic">{currentGallery[subIndex].caption}</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
