import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MIS_FOTOS, MIS_VIAJES } from '../data/mis_viajes';
import { Lightbox } from './Lightbox';

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

  React.useEffect(() => { 
    setSelectedId(null); 
    setSubIndex(0); 
  }, [location]);

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
              <img src={photo.url} alt={photo.titulo} className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="text-gold text-[10px] uppercase tracking-widest">{photo.ubicacion}</p>
                <h4 className="font-serif text-lg text-white">{photo.titulo}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX UNIFICADO - Reemplaza las ~100 líneas anteriores */}
      <Lightbox
        isOpen={selectedId !== null}
        onClose={() => setSelectedId(null)}
        photos={currentGallery}
        currentIndex={subIndex}
        onNavigate={navigate}
        ubicacion={selectedExpedition?.ubicacion || ''}
      />
    </section>
  );
};

