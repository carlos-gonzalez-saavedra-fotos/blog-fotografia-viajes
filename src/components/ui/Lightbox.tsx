import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, BookOpen, RotateCw, AlertCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

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

  // Reset de estado de carga al cambiar de foto
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryKey(0);
  }, [currentIndex, isOpen]);

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

  // URL con parámetro de reintento si se produce error de red
  const imageUrl = currentPhoto?.url 
    ? (retryKey > 0 ? `${currentPhoto.url}${currentPhoto.url.includes('?') ? '&' : '?'}t=${Date.now()}` : currentPhoto.url)
    : '';

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-xl flex flex-col" 
          onClick={onClose}
        >
          {/* Header Superior (Logo y Acciones) */}
          <div className="w-full px-6 py-4 md:px-10 flex justify-between items-center z-[100] bg-black/50 backdrop-blur-sm">
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
          <div className="w-full px-6 md:px-20 py-2 flex justify-between items-center z-[90]">
            <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-medium">
              {headerText}
            </span>
            <span className="text-white/40 text-[10px] tracking-[0.5em] uppercase">
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

          {/* Contenedor de Imagen */}
          <div className="flex-grow flex items-center justify-center p-4 overflow-hidden relative">
            {/* Indicador sutil de carga (Spinner / Skeleton) */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                <div className="w-9 h-9 rounded-full border border-gold/20 border-t-gold animate-spin mb-4" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-light">
                  Cargando fotografía...
                </span>
              </div>
            )}

            {/* Aviso y botón de reintento si la red falla */}
            {hasError && (
              <div 
                className="relative z-20 py-12 px-8 flex flex-col items-center justify-center text-center max-w-sm bg-neutral-900/80 border border-white/10 backdrop-blur-md rounded-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <AlertCircle className="w-8 h-8 text-gold/80 mb-4 stroke-thin" />
                <p className="font-serif text-lg text-white mb-2">Respuesta demorada</p>
                <p className="text-xs text-white/50 mb-6 font-light leading-relaxed">
                  El servidor de la imagen está tardando en responder. Pulsa para reintentar la conexión.
                </p>
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    setRetryKey(prev => prev + 1);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/60 text-gold hover:bg-gold hover:text-black text-[10px] uppercase tracking-[0.25em] transition-all duration-300"
                >
                  <RotateCw size={14} />
                  <span>Reintentar carga</span>
                </button>
              </div>
            )}

            <div 
              className={`relative flex flex-col items-center transition-all duration-500 ${isPortrait ? 'lg:max-w-[40%]' : 'w-full max-w-5xl'} ${hasError ? 'hidden' : 'block'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen Principal */}
              <motion.img 
                key={`${currentPhoto.url}-${retryKey}`}
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onPanEnd={handlePanEnd}
                src={imageUrl}
                alt={currentPhoto.caption || currentPhoto.titulo || 'Fotografía'}
                referrerPolicy="no-referrer"
                decoding="async"
                className="max-w-full shadow-2xl object-contain z-10"
                style={{ maxHeight: '72vh', touchAction: 'pan-y pinch-zoom' }}
                onLoad={(e) => {
                  setIsLoading(false);
                  setHasError(false);
                  setIsPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth);
                }}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />

              {/* Caption */}
              <div className="mt-8 text-center w-full px-4 z-20">
                {currentPhoto.caption && (
                  <p className="font-cormorant text-xl md:text-2xl text-white/80 italic mb-4 leading-relaxed tracking-wide">
                    {currentPhoto.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
