import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MIS_VIAJES, MIS_FOTOS } from '../data/mis_viajes';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { MapPin, ArrowLeft, Quote, Search } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Lightbox } from '../components/ui/Lightbox';

export const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Buscar en viajes y en fotos (galerías temáticas)
  const viaje = MIS_VIAJES.find(v => v.id === id) || (MIS_FOTOS.find(f => f.id === id) as any);
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Normalizar la galería (puede ser .galeria o .galeriaTematica)
  const fotosGaleria = viaje?.galeria || viaje?.galeriaTematica || [];
  // Una galería es temática si tiene el campo galeriaTematica OR si su ID empieza por "Gale"
  const esTematica = !!viaje?.galeriaTematica || viaje?.id?.startsWith('Gale');

  useEffect(() => {
    setSelectedIndex(null);
    setIsPortrait(false);
  }, [location]);

  useEffect(() => {
    setIsPortrait(false);
  }, [selectedIndex]);

  // RESTAURADO: Lógica de scroll original reforzada
  useEffect(() => {
    if (window.location.hash === '#galeria') {
      setTimeout(() => {
        scrollToGallery();
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, location.pathname, location.key]);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const handlePanEnd = (_e: any, info: PanInfo) => {
    if (!fotosGaleria.length) return;
    if (info.offset.x < -50) setSelectedIndex((selectedIndex! + 1) % fotosGaleria.length);
    else if (info.offset.x > 50) setSelectedIndex((selectedIndex! - 1 + fotosGaleria.length) % fotosGaleria.length);
  };

  if (!viaje) return <div className="min-h-screen bg-black" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-black text-white font-light">
      <Helmet><title>{viaje.titulo} | Carlos González Saavedra</title></Helmet>
      
      {/* Header / Hero */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 1.5 }} 
          src={viaje.urlImagen || viaje.url} 
          alt={viaje.titulo}
          width={1920}
          height={1080}
          decoding="async"
          className="w-full h-full object-cover opacity-60 grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.4em] mb-6">
            <MapPin size={14} strokeWidth={1.5} /> {viaje.ubicacion}
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="font-serif text-5xl md:text-8xl lg:text-9xl mb-8 tracking-tighter">{viaje.titulo}</motion.h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <Link 
          to={esTematica ? "/#galeria" : "/#viajes"} 
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-gold transition-colors mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver a {esTematica ? "Galería" : "Viajes"}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-1 space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Fecha</p>
              <p className="text-sm text-white/60 tracking-wider">{viaje.fecha || 'Próximamente'}</p>
            </div>
            {viaje.categoria && (
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Categoría</p>
                <p className="text-sm text-white/60 tracking-wider">{viaje.categoria}</p>
              </div>
            )}
            {viaje.equipo && (
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Equipo</p>
                <p className="text-sm text-white/60 tracking-wider">{viaje.equipo}</p>
              </div>
            )}
            {fotosGaleria.length > 0 && (
              <button 
                onClick={scrollToGallery} 
                className="w-full py-4 border border-white/10 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-all duration-500 flex items-center justify-center gap-2"
              >
                <span>Ver Galería</span>
                <span className="text-white/40">({fotosGaleria.length})</span>
              </button>
            )}
          </div>

          <div className="md:col-span-3 space-y-16">
            {viaje.resumen && (!viaje.reseña || !viaje.reseña.startsWith(viaje.resumen.slice(0, 30))) && (
              <div className="border-l-2 border-gold/60 pl-6 py-2">
                <p className="font-serif italic text-xl md:text-2xl text-gold/90 leading-relaxed font-normal">
                  "{viaje.resumen}"
                </p>
              </div>
            )}

            {viaje.reseña && (
              <div className="prose prose-invert prose-lg max-w-none">
                {viaje.reseña.split('\n').filter((p: string) => p.trim() !== '').map((p: any, i: number) => (
                  <p key={i} className="text-white/80 leading-relaxed font-light mb-8 text-lg md:text-xl selection:bg-gold/30">{p}</p>
                ))}
              </div>
            )}

            {/* CONTENEDOR DE LA GALERÍA */}
            {fotosGaleria.length > 0 && (
              <div ref={galleryRef} id="galeria" className="pt-16 border-t border-white/10">
                <div className="flex items-center justify-between mb-8 pb-4">
                  <div>
                    <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-1">Fotografías incluidas</p>
                    <h3 className="font-serif text-2xl text-white">Colección ({fotosGaleria.length})</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedIndex(0)}
                    className="text-[10px] uppercase tracking-[0.3em] text-gold hover:text-white transition-colors flex items-center gap-2 border border-gold/30 hover:border-gold px-4 py-2"
                  >
                    <span>Pantalla completa</span>
                    <span className="text-xs">→</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(esTematica ? fotosGaleria : fotosGaleria.slice(0, 6)).map((item: any, i: number) => {
                    const isLast = !esTematica && i === 5 && fotosGaleria.length > 6;
                    const itemUrl = typeof item === 'string' ? item : item.url;
                    const itemCaption = typeof item === 'string' ? '' : item.caption;
                    return (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }} 
                        onClick={() => setSelectedIndex(i)} 
                        className="aspect-square cursor-zoom-in overflow-hidden relative group bg-neutral-900"
                      >
                        <img 
                          src={itemUrl} 
                          alt={itemCaption || viaje.titulo}
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={400}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                        />
                        
                        {isLast ? (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                            <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-2">Galería Completa</p>
                            <p className="text-2xl font-serif text-white">+{fotosGaleria.length - 5}</p>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                            {itemCaption && (
                              <p className="text-xs text-white/90 font-light line-clamp-2 mb-2">{itemCaption}</p>
                            )}
                            <div className="flex items-center gap-1.5 text-gold text-[10px] uppercase tracking-wider">
                              <Search className="w-3.5 h-3.5 stroke-thin" />
                              <span>Ampliar</span>
                            </div>
                          </div>
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

      {/* Lightbox Unificado */}
      <Lightbox 
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        currentIndex={selectedIndex || 0}
        onIndexChange={(index) => setSelectedIndex(index)}
        photos={fotosGaleria.map((item: any) => ({
          url: typeof item === 'string' ? item : item.url,
          caption: typeof item === 'string' ? undefined : item.caption,
          titulo: viaje.titulo,
          ubicacion: viaje.ubicacion,
          tripId: viaje.id
        }))}
      />
    </motion.div>
  );
};
