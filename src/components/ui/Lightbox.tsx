import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LightboxPhoto {
  url: string;
  caption?: string;
  ubicacion?: string;
  titulo?: string;
  tripId?: string;
  useTitleAsHeader?: boolean;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photos: LightboxPhoto[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  photos,
  currentIndex,
  onIndexChange,
}) => {
  const [isPortrait, setIsPortrait] = useState(false);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Bloqueo de scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Precarga inteligente (Prefetch) de la foto siguiente y anterior
  useEffect(() => {
    if (!isOpen || !photos || photos.length === 0) return;

    // Precargamos la siguiente (+1), la anterior (-1) y la subsiguiente (+2)
    const indicesToPreload = [
      (currentIndex + 1) % photos.length,
      (currentIndex - 1 + photos.length) % photos.length,
      (currentIndex + 2) % photos.length
    ];

    indicesToPreload.forEach(idx => {
      const targetPhoto = photos[idx];
      if (targetPhoto && targetPhoto.url) {
        const prefetchImg = new Image();
        prefetchImg.referrerPolicy = 'no-referrer';
        prefetchImg.src = targetPhoto.url;
      }
    });
  }, [isOpen, currentIndex, photos]);

  const navigate = (direction: number) => {
    if (photos.length <= 1) return;
    onIndexChange((currentIndex + direction + photos.length) % photos.length);
  };

  const handlePanEnd = (_e: any, info: PanInfo) => {
    if (info.offset.x < -50) navigate(1);
    else if (info.offset.x > 50) navigate(-1);
  };

  const currentPhoto = photos[currentIndex];

  // Lógica de encabezado ultra-robusta:
  let headerText = currentPhoto?.ubicacion;
  if (currentPhoto?.useTitleAsHeader && currentPhoto?.titulo) {
    headerText = currentPhoto.titulo;
  } else if (!currentPhoto?.tripId && currentPhoto?.titulo) {
    headerText = currentPhoto.titulo;
  }

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-xl flex flex-col justify-between h-[100dvh] max-h-[100dvh] overflow-hidden" 
          onClick={onClose}
        >
          {/* Header Superior (Logo y Acciones) */}
          <div className="w-full px-6 py-4 md:px-10 flex justify-between items-center z-[100] bg-black/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-gold" />
              <span className="font-serif text-lg tracking-[0.3em] text-white uppercase">CGS</span>
            </div>
            
            <div className="flex items-center gap-6">
              {currentPhoto.tripId && (
                <Link 
                  to={`/viaje/${currentPhoto.tripId}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(); // Cierre inmediato para forzar el scroll
                  }}
                  className="group flex items-center gap-3 text-white/40 hover:text-gold transition-all duration-500"
                  title="Leer crónica completa"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
                    Crónica completa
                  </span>
                  <BookOpen size={24} strokeWidth={1} className="transition-transform group-hover:scale-110" />
                </Link>
              )}
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-gold p-2 transition-transform hover:rotate-90"
              >
                <X size={32} strokeWidth={1} />
              </button>
            </div>
          </div>

          {/* Metadatos Superiores (Ubicación/Título y Contador) */}
          <div className="w-full px-6 md:px-20 py-2 flex justify-between items-start gap-4 z-[90] shrink-0">
            <span className="flex-1 text-gold text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-medium leading-relaxed">
              {headerText}
            </span>
            <span className="shrink-0 text-white/40 text-[10px] tracking-[0.5em] uppercase self-start pt-0.5">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          {/* Navegación Desktop */}
          {photos.length > 1 && (
            <>
              <button 
                className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[100] transition-all p-4" 
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                aria-label="Fotografía anterior"
              >
                <ChevronLeft size={64} strokeWidth={1} />
              </button>
              <button 
                className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-[100] transition-all p-4" 
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                aria-label="Siguiente fotografía"
              >
                <ChevronRight size={64} strokeWidth={1} />
              </button>
            </>
          )}

          {/* Contenedor de Imagen Central */}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center px-4 py-2 overflow-hidden relative">
            <div 
              className={`relative flex items-center justify-center w-full h-full max-h-full transition-all duration-500 ${isPortrait ? 'lg:max-w-[45%]' : 'max-w-5xl'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen Principal */}
              <motion.img 
                key={currentPhoto.url}
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onPanEnd={handlePanEnd}
                src={currentPhoto.url}
                alt={currentPhoto.caption || currentPhoto.titulo || 'Fotografía'}
                referrerPolicy="no-referrer"
                decoding="async"
                className="max-w-full max-h-full shadow-2xl object-contain z-10 select-none"
                style={{ touchAction: 'pan-y pinch-zoom' }}
                onLoad={(e) => {
                  setIsPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth);
                }}
              />
            </div>
          </div>

          {/* Caption Inferior con espacio reservado independiente y soporte safe-area */}
          <div 
            className="w-full shrink-0 px-6 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {currentPhoto.caption && (
              <p className="font-cormorant text-lg sm:text-xl md:text-2xl text-white/80 italic leading-snug sm:leading-relaxed tracking-wide max-w-4xl mx-auto">
                {currentPhoto.caption}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
