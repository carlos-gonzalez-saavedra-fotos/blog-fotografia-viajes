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
                "La fotografía es un arte de observación. He descubierto que tiene poco que ver con las cosas que ves y todo que ver con la forma en que las ves."
              </h2>
              <p className="mt-8 text-[10px] uppercase tracking-[0.5em] text-gold">Elliott Erwitt</p>
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
                  src="https://i.postimg.cc/hGT4nDHZ/Chat-GPT-Image-6-mar-2026-12-43-29.webp" 
                  alt="Carlos González Saavedra"
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="font-serif text-4xl md:text-6xl">Carlos González Saavedra</h2>
                <p className="text-white/60 leading-relaxed">
                  La fotografía y los viajes son formas de meditación en tránsito. El cuerpo se desplaza temporalmente, y la mente se sumerge en un estado de concentrada atención, dispuesta a descubrir la cotidiana belleza que cada lugar ofrece, generoso, a quien sabe observar con paciencia y apertura.
                </p>
                <p className="text-white/60 leading-relaxed">
                  La senda habrá sido provechosa si, con el paso del tiempo, al volver la vista atrás, constatamos complacidos como aún palpitan en nosotros los fúlgidos ecos del sublime mundo que hemos conocido.
                </p>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
