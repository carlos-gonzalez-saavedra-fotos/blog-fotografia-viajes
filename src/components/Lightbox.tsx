import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface LightboxPhoto {
  url: string;
  caption?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photos: LightboxPhoto[];
  currentIndex: number;
  onNavigate: (direction: number) => void;
  ubicacion: string;
  renderFooter?: (photo: LightboxPhoto, index: number) => React.ReactNode;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen, onClose, photos, currentIndex, onNavigate, ubicacion, renderFooter
}) => {
  const [isPortrait, setIsPortrait] = React.useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => { setIsPortrait(false); }, [currentIndex]);

  const handlePanEnd = (_e: any, info: PanInfo) => {
    if (info.offset.x < -50) onNavigate(1);
    else if (info.offset.x > 50) onNavigate(-1);
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/98 flex flex-col" onClick={onClose}>
        <div className="w-full px-6 py-4 md:px-10 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-gold" />
            <span className="font-serif text-lg tracking-[0.3em] uppercase text-white">CGS</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-gold p-2 transition-transform hover:rotate-90">
            <X size={32} strokeWidth={1} />
          </button>
        </div>

        {photos.length > 1 && (
          <>
            <button className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-50 transition-all" 
              onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}>
              <ChevronLeft size={64} strokeWidth={1} />
            </button>
            <button className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold z-50 transition-all" 
              onClick={(e) => { e.stopPropagation(); onNavigate(1); }}>
              <ChevronRight size={64} strokeWidth={1} />
            </button>
          </>
        )}

        <div className="flex-grow flex items-center justify-center p-4">
          <div className={`relative flex flex-col items-center ${isPortrait ? 'lg:max-w-[40%]' : 'w-full max-w-5xl'}`}>
            <div className="w-full flex justify-between text-[10px] text-gold uppercase tracking-[0.5em] mb-6 px-2">
              <span>{ubicacion}</span>
              <span className="text-white/40">{currentIndex + 1} / {photos.length}</span>
            </div>
            <motion.img 
              key={currentPhoto.url}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onPanEnd={handlePanEnd}
              src={currentPhoto.url} 
              className="max-w-full shadow-2xl object-contain"
              style={{ maxHeight: '70vh', touchAction: 'pan-y pinch-zoom' }}
              onLoad={(e) => setIsPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-8 text-center w-full px-4">
              <AnimatePresence mode="wait">
                {currentPhoto.caption && (
                  <motion.p key={`caption-${currentIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                    className="font-cormorant text-xl md:text-2xl text-white/80 italic mb-6 leading-relaxed">
                    {currentPhoto.caption}
                  </motion.p>
                )}
              </AnimatePresence>
              {renderFooter && renderFooter(currentPhoto, currentIndex)}
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
