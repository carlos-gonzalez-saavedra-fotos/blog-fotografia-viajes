import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MIS_FOTOS, MIS_VIAJES } from '../data/mis_viajes';

export const PhotographySection = () => {
  const allGalleries = React.useMemo(() => {
    const tripGalleries = MIS_VIAJES.filter(v => v.galeria && v.galeria.length > 0).map(v => ({
      id: v.id, 
      url: v.urlImagen, 
      titulo: v.titulo, 
      ubicacion: v.ubicacion, 
      galeriaTematica: v.galeria,
      fecha: v.fecha,
      categoria: v.categoria,
      esViaje: true // Flag para identificar que es un viaje con crónica
    }));
    const photoGalleries = MIS_FOTOS.map(f => ({ ...f, esViaje: false }));
    return [...photoGalleries, ...tripGalleries];
  }, []);

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
              className="break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to={`/viaje/${photo.id}`}
                className="block relative group cursor-pointer overflow-hidden rounded-sm bg-neutral-950"
              >
                <img 
                  src={photo.url} 
                  alt={photo.titulo} 
                  loading="lazy"
                  className="w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <p className="text-gold text-[10px] uppercase tracking-widest mb-1 font-medium">{photo.ubicacion}</p>
                  <h4 className="font-serif text-xl md:text-2xl text-white mb-3 tracking-tight">{photo.titulo}</h4>
                  
                  <div className="flex items-center justify-between text-white/60 text-xs font-light pt-3 border-t border-white/10">
                    <span className="text-[11px] tracking-wider text-white/70">
                      {photo.fecha || ''}
                      {photo.galeriaTematica?.length ? ` · ${photo.galeriaTematica.length} fotos` : ''}
                    </span>
                    <span className="text-gold text-[11px] uppercase tracking-wider font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ver galería →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
