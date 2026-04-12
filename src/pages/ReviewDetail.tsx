import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MIS_VIAJES } from '../data/mis_viajes';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { MapPin, Quote, X, Search, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ReviewDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const viaje = MIS_VIAJES.find(v => v.id === id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => { setSelectedIndex(null); window.scrollTo(0, 0); }, [id, location]);

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const handlePanEnd = (_e: any, info: PanInfo) => {
    if (!viaje?.galeria) return;
    if (info.offset.x < -50) setSelectedIndex((selectedIndex! + 1) % viaje.galeria.length);
    else if (info.offset.x > 50) setSelectedIndex((selectedIndex! - 1 + viaje.galeria.length) % viaje.galeria.length);
  };

  if (!viaje) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet><title>{viaje.titulo}</title></Helmet>
      
      <div className="relative h-[60vh]">
        <img src={viaje.urlImagen} className="w-full h-full object-cover opacity-50 grayscale" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <MapPin className="text-gold mb-4" />
          <h1 className="font-serif text-4xl md:text-7xl">{viaje.titulo}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-invert lg:prose-xl mx-auto">
          {viaje.reseña.split('\n').map((p, i) => <p key={i} className="text-white/70 mb-6">{p}</p>)}
        </div>

        {viaje.galeria && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-20">
            {viaje.galeria.map((item, i) => (
              <div key={i} onClick={() => setSelectedIndex(i)} className="aspect-square cursor-zoom-in overflow-hidden">
                <img src={typeof item === 'string' ? item : item.url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && viaje.galeria && (
          <div className="fixed inset-0 z-[9999] bg-black/98 flex flex-col" onClick={() => setSelectedIndex(null)}>
            <div className="w-full px-6 py-4 flex justify-between items-center z-10">
              <Camera className="w-5 h-5 text-gold" />
              <button onClick={() => setSelectedIndex(null)} className="text-white"><X size={32} /></button>
            </div>
            <div className="flex-grow flex items-center justify-center p-4 overflow-auto">
              <div className="w-full max-w-5xl flex flex-col items-center">
                <div className="w-full flex justify-between text-gold text-[10px] mb-4">
                  <span>{viaje.ubicacion}</span>
                  <span>{selectedIndex + 1} / {viaje.galeria.length}</span>
                </div>
                <motion.img 
                  key={selectedIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onPanEnd={handlePanEnd}
                  src={typeof viaje.galeria[selectedIndex] === 'string' ? viaje.galeria[selectedIndex] as string : (viaje.galeria[selectedIndex] as any).url}
                  className="max-w-full shadow-2xl"
                  style={{ maxHeight: '70vh', touchAction: 'pan-y pinch-zoom' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
