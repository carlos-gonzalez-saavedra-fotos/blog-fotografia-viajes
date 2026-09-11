import { ArrowDown } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="https://res.cloudinary.com/tsruit2h/image/upload/f_auto,q_auto,w_800,c_limit/v1789063601/cgs_portfolio/Playa-de-las-Catedrales.webp" 
          />
          <source 
            media="(min-width: 769px)" 
            srcSet="https://res.cloudinary.com/tsruit2h/image/upload/f_auto,q_auto,w_1920,c_limit/v1789063601/cgs_portfolio/Playa-de-las-Catedrales.webp" 
          />
          <img 
            src="https://res.cloudinary.com/tsruit2h/image/upload/f_auto,q_auto,w_800,c_limit/v1789063601/cgs_portfolio/Playa-de-las-Catedrales.webp" 
            alt="Playa de las Catedrales - Galicia"
            width={1920}
            height={1080}
            decoding="sync"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
      </div>

      <div className="relative z-10 text-center px-4">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold mb-6">
          Fotografía & Relatos
        </p>
        
        <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl mb-8 leading-tight">
          Fúlgidos <br />
          <span className="italic">Ecos</span>
        </h1>

        <div className="flex flex-col items-center gap-4">
          <div className="w-[1px] h-24 bg-gradient-to-b from-gold/0 to-gold" />
          <ArrowDown className="w-4 h-4 text-gold animate-bounce" />
        </div>
      </div>

      {/* Decorative Side Text */}
      <div className="hidden lg:block absolute left-12 bottom-24 rotate-[-90deg] origin-left">
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">
          Carlos González Saavedra — Portfolio 2026
        </p>
      </div>
    </section>
  );
};
