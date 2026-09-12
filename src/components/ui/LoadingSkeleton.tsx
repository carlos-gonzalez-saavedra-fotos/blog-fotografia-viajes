import React, { useEffect } from 'react';
import { getViajeResumenById } from '../../data/viajesResumen';
import { getOptimizedImageUrl } from '../../utils/image';

export const ChronicleSkeleton: React.FC = () => {
  // Disparo anticipado de la imagen LCP en paralelo durante la fase de carga
  useEffect(() => {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/viaje\/([^/]+)/);
    if (match && match[1]) {
      const resumen = getViajeResumenById(match[1]);
      const rawUrl = (resumen as any)?.urlImagen || (resumen as any)?.url;
      if (rawUrl) {
        const optimizedUrl = getOptimizedImageUrl(rawUrl, { width: 1920, crop: 'limit' });
        // Inyecta el <link rel="preload" as="image" fetchpriority="high"> si no existe ya
        if (!document.querySelector(`link[rel="preload"][href="${optimizedUrl}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = optimizedUrl;
          link.setAttribute('fetchpriority', 'high');
          document.head.appendChild(link);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-light selection:bg-gold selection:text-black">
      {/* Hero Skeleton */}
      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden bg-neutral-950 flex flex-col justify-end items-center pb-16 px-6">
        {/* Subtle pulsating gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/30 via-neutral-950/70 to-black animate-pulse" />

        {/* Central loader indicator */}
        <div className="relative z-10 flex flex-col items-center gap-4 mb-8">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border border-gold/20 rounded-full" />
            <div className="w-10 h-10 border-2 border-transparent border-t-gold rounded-full animate-spin" />
            <div className="w-2 h-2 bg-gold/80 rounded-full" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold/90 font-serif">
            Cargando crónica...
          </p>
        </div>

        {/* Skeleton Title & Metadata placeholders */}
        <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-4">
          <div className="h-3 w-32 bg-gold/20 rounded-full animate-pulse" />
          <div className="h-10 md:h-14 w-3/4 max-w-xl bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-48 bg-white/10 rounded-full animate-pulse mt-2" />
        </div>
      </div>

      {/* Body Content Skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Metadata pill bar */}
        <div className="flex flex-wrap items-center gap-6 border-y border-white/10 py-4 mb-12">
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-28 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Quote placeholder */}
        <div className="border-l-2 border-gold/40 pl-6 py-2 mb-12 space-y-3">
          <div className="h-4 w-5/6 bg-gold/15 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-gold/15 rounded animate-pulse" />
        </div>

        {/* Paragraphs */}
        <div className="space-y-4">
          <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-11/12 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};
