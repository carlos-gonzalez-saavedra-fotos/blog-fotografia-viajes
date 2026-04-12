import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MIS_VIAJES } from '../data/mis_viajes';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { MapPin, Quote, X, Search, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export const ReviewDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const viaje = MIS_VIAJES.find(v => v.id === id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSelectedIndex(null); window.scrollTo(0, 0); }, [id, location]);
  useEffect(() => { setIsPortrait(false); }, [selectedIndex]);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      <Helmet><title>{viaje.titulo} | Carlos González Saavedra</title></Helmet>
      
      <div className="relative h-[70vh]">
        <img src={viaje.urlImagen} className="w-full h-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.4em] mb-4">
            <MapPin size={14} />{viaje.ubicacion}
          </div>
          <h1 className="font-serif text-5xl md:text-8xl">{viaje.titulo}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gold">Fecha</p>
              <p className="text-sm font-light text-white/60">{viaje.fecha || 'Pendiente'}</p>
            </div>
            <button onClick={scrollToGallery} className="w-full py-4 border border-white/10 text-[10px] uppercase tracking-widest hover:border-gold hover:text-gold transition-all">Ver Galería</button>
          </div>

          <div className="md:col-span-3 space-y-12">
            <div className="prose prose-invert prose-lg max-w-none">
              {viaje.reseña.split('\n').map((p, i) => <p key={i} className="text-white/80 leading-relaxed font-light mb-6 text-lg">{p}</p>)}
            </div>

            <div ref={galleryRef} className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
              {viaje.galeria?.map((item, i) => (
                <div key={i} onClick={() => setSelectedIndex(i)} className="aspect-square cursor-zoom-in overflow-hidden border border-white/5 relative group">
                  <img src={typeof item === 'string' ? item : item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Search className="text-white w-6 h-6" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && viaje.galeria && (
          <div className="fixed inset-0 z-[9999] bg-black/98 flex flex-col" onClick={() => setSelectedIndex(null)}>
            <div className="w-full px-6 py-4 md:px-10 flex justify-between items-center z-10">
              <div className="flex items-center gap-2"><Camera className="w-5 h-5 text-gold" /><span className="font-serif text-lg tracking-widest uppercase text-white hidden sm:inline">CGS</span></div>
              <button onClick={() => setSelectedIndex(null)} className="text-white/80 hover:text-gold p-3 transition-all hover:rotate-90"><X size={24} /></button>
            </div>

            {viaje.galeria.length > 1 && (
              <>
                <button className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all" onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex - 1 + viaje.galeria!.length) % viaje.galeria!.length); }}><ChevronLeft size={56} strokeWidth={1} /></button>
                <button className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[10000] p-4 transition-all" onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + 1) % viaje.galeria!.length); }}><ChevronRight size={56} strokeWidth={1} /></button>
              </>
            )}

            <div className="flex-grow flex items-center justify-center p-4 overflow-hidden">
              <div className={`relative flex flex-col items-center transition-all duration-500 ${isPortrait ? 'lg:max-w-[45%]' : 'w-full max-w-5xl'}`}>
                <div className="w-full flex justify-between text-[10px] text-gold uppercase tracking-[0.5em] mb-4">
                  <span>{viaje.ubicacion}</span>
                  <span>{selectedIndex + 1} / {viaje.galeria.length}</span>
                </div>
                <motion.img 
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onPanEnd={handlePanEnd}
                  src={typeof viaje.galeria[selectedIndex] === 'string' ? viaje.galeria[selectedIndex] as string : (viaje.galeria[selectedIndex] as any).url}
                  className="max-w-full shadow-2xl object-contain"
                  style={{ maxHeight: '60vh', touchAction: 'pan-y pinch-zoom' }}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    setIsPortrait(img.naturalHeight > img.naturalWidth);
                  }}
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
