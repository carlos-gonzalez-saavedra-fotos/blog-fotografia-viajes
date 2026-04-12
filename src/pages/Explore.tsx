import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MIS_VIAJES } from '../data/mis_viajes';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
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

  // RESTAURADO: Lógica de scroll original
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-black text-white font-light">
      <Helmet><title>{viaje.titulo} | Carlos González Saavedra</title></Helmet>
      
      {/* Header / Hero */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src={viaje.urlImagen} className="w-full h-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.4em] mb-6">
            <MapPin size={14} strokeWidth={1.5} /> {viaje.ubicacion}
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="font-serif text-5xl md:text-8xl lg:text-9xl mb-8">{viaje.titulo}</motion.h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-1 space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Fecha</p>
              <p className="text-sm text-white/60 tracking-wider">{viaje.fecha || 'Próximamente'}</p>
            </div>
            {/* BOTÓN RESTAURADO: Ahora sí hace scroll al ref */}
            <button onClick={scrollToGallery} className="w-full py-4 border border-white/10 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-all duration-500">
              Ver Galería
            </button>
          </div>

          <div className="md:col-span-3 space-y-20">
            <div className="prose prose-invert prose-lg max-w-none">
              {viaje.reseña.split('\n').map((p, i) => (
                <p key={i} className="text-white/80 leading-relaxed font-light mb-8 text-xl selection:bg-gold/30">{p}</p>
              ))}
            </div>

            {/* CONTENEDOR RESTAURADO CON REF Y ID */}
            <div ref={galleryRef} id="galeria" className="pt-20 grid grid-cols-2 md:grid-cols-3 gap-1">
              {viaje.galeria?.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} onClick={() => setSelectedIndex(i)} className="aspect-square cursor-zoom-in overflow-hidden relative group">
                  <img src={typeof item === 'string' ? item : item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <Search className="text-white w-5 h-5 stroke-thin" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox con Flechas y Zoom Arreglado */}
      <AnimatePresence>
        {selectedIndex !== null && viaje.galeria && (
          <div className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-xl flex flex-col" onClick={() => setSelectedIndex(null)}>
            <div className="w-full px-6 py-4 md:px-10 flex justify-between items-center z-10">
              <div className="flex items-center gap-3"><Camera className="w-5 h-5 text-gold" /><span className="font-serif text-lg tracking-[0.3em] text-white">CGS</span></div>
              <button onClick={() => setSelectedIndex(null)} className="text-white/80 hover:text-gold p-2 transition-transform hover:rotate-90"><X size={32} strokeWidth={1} /></button>
            </div>

            {/* Flechas Desktop Restauradas */}
            <button className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-50 transition-all" onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex - 1 + viaje.galeria!.length) % viaje.galeria!.length); }}><ChevronLeft size={64} strokeWidth={1} /></button>
            <button className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-50 transition-all" onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + 1) % viaje.galeria!.length); }}><ChevronRight size={64} strokeWidth={1} /></button>

            <div className="flex-grow flex items-center justify-center p-4">
              <div className={`relative flex flex-col items-center ${isPortrait ? 'lg:max-w-[40%]' : 'w-full max-w-5xl'}`}>
                <div className="w-full flex justify-between text-[10px] text-gold uppercase tracking-[0.5em] mb-6 px-2">
                  <span>{viaje.ubicacion}</span>
                  <span className="text-white/40">{selectedIndex + 1} / {viaje.galeria.length}</span>
                </div>
                <motion.img 
                  key={selectedIndex}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onPanEnd={handlePanEnd}
                  src={typeof viaje.galeria[selectedIndex] === 'string' ? viaje.galeria[selectedIndex] as string : (viaje.galeria[selectedIndex] as any).url}
                  className="max-w-full shadow-2xl object-contain"
                  style={{ maxHeight: '70vh', touchAction: 'pan-y pinch-zoom' }}
                  onLoad={(e) => setIsPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
