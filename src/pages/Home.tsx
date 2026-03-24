import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { BlogSection } from '../components/BlogSection';
import { PhotographySection } from '../components/PhotographySection';
import { Footer } from '../components/Footer';
import { motion, useScroll, useSpring } from 'motion/react';

export const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-black selection:bg-gold selection:text-black">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />
      
      <main>
        <Hero />
        
        <div className="relative z-10">
          <BlogSection />
          
          {/* Quote Section */}
          <section className="py-32 px-6 bg-black flex items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <h2 className="font-serif text-3xl md:text-5xl italic leading-relaxed text-balance">
                "La fotografía es un secreto sobre un secreto, cuanto más te dice, menos sabes."
              </h2>
              <p className="mt-8 text-[10px] uppercase tracking-[0.5em] text-gold">Diane Arbus</p>
            </motion.div>
          </section>

          <PhotographySection />

          {/* About Section */}
          <section id="sobre-mi" className="py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[3/4] overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1974" 
                  alt="Carlos González Saavedra"
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border-[20px] border-black/20" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="font-serif text-4xl md:text-6xl">Carlos González Saavedra</h2>
                <p className="text-white/60 leading-relaxed">
                  Nacido con una cámara en la mano y un mapa en el corazón. Llevo más de una década recorriendo el mundo buscando historias que merezcan ser contadas. Mi enfoque combina la precisión técnica de la fotografía de paisaje con la narrativa íntima del periodismo de viajes.
                </p>
                <p className="text-white/60 leading-relaxed">
                  Este espacio es mi diario visual y mi cuaderno de bitácora. Aquí comparto no solo lo que veo, sino lo que siento al estar frente a la inmensidad de la naturaleza o la complejidad de una nueva cultura.
                </p>
                <div className="pt-8">
                  <button className="px-8 py-4 border border-gold text-gold text-xs uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-500">
                    Conoce mi equipo
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
