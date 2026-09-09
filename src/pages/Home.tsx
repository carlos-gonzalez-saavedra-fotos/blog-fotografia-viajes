import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { BlogSection } from '../components/BlogSection';
import { PhotographySection } from '../components/PhotographySection';
import { Footer } from '../components/Footer';
import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const Home = () => {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-black selection:bg-gold selection:text-black">
      <Helmet>
        <title>Carlos González Saavedra | Fotografía & Relatos de Viaje</title>
        <meta name="description" content="Explora el mundo a través de la lente y la pluma de Carlos González Saavedra. Fotografía artística, crónicas de viaje y relatos que capturan la esencia de cada destino." />
        <meta name="keywords" content="Carlos González Saavedra, fotografía, relatos de viaje, crónicas, viajes, arte, fotografía artística, blog de viajes" />
        <link rel="canonical" href="https://carlos-gonzalez-saavedra.vercel.app/" />
      </Helmet>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-[60] origin-left"
        style={{ scaleX }}
      />
      
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
                "Un extraño tejido de espacio y tiempo: la aparición única de una lejanía, por cercana que pueda estar."
              </h2>
              <p className="mt-8 text-[10px] uppercase tracking-[0.5em] text-gold">Walter Benjamin</p>
            </motion.div>
          </section>

          <PhotographySection />

          {/* About Section */}
          <section id="el-autor" className="py-32 px-6 bg-black border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-16 items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-32 md:w-48 shrink-0 mx-auto md:mx-0"
                >
                  <div className="aspect-[3/4] overflow-hidden grayscale opacity-60 hover:opacity-100 transition-opacity duration-1000">
                    <img 
                      src="https://i.postimg.cc/GhB8RZvM/Carlos-Gonzalez-Saavedra.webp" 
                      alt="Carlos González Saavedra"
                      loading="lazy"
                      decoding="async"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6 flex-grow"
                >
                  <p className="text-gold text-[10px] uppercase tracking-[0.5em]">El Autor</p>
                  <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl">Carlos González Saavedra</h2>
                  <div className="space-y-6 text-white/50 leading-relaxed text-sm md:text-base font-light">
                    <p>
                      La fotografía y los viajes son formas de meditación en tránsito. El cuerpo se desplaza temporalmente, y la mente se sumerge en un estado de concentrada atención, dispuesta a descubrir la cotidiana belleza que cada lugar ofrece, generoso, a quien sabe observar con paciencia y apertura.
                    </p>
                    <p>
                      La senda habrá sido provechosa si, con el paso del tiempo, al volver la vista atrás, constatamos complacidos como aún palpitan en nosotros los fúlgidos ecos del sublime mundo que hemos conocido.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
