import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest">Volver al inicio</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl mb-12 tracking-tight">Aviso Legal</h1>
          
          <div className="space-y-12 text-white/70 leading-relaxed font-light">
            <section>
              <h2 className="text-white font-serif text-xl mb-4 uppercase tracking-widest">1. Propiedad Intelectual</h2>
              <p>
                Todo el contenido de este sitio web, incluyendo textos, fotografías, gráficos, logotipos e iconos, es propiedad exclusiva de <strong>Carlos González Saavedra</strong>, a menos que se indique lo contrario. Queda prohibida la reproducción, distribución, comunicación pública o transformación de cualquier contenido de esta web sin la autorización expresa y por escrito del autor.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-xl mb-4 uppercase tracking-widest">2. Uso de las Imágenes</h2>
              <p>
                Las fotografías presentadas en este portafolio son el resultado de un trabajo creativo personal. El uso no autorizado de las mismas en otros sitios web, redes sociales o medios impresos constituye una infracción de los derechos de autor. Si desea utilizar alguna imagen para fines educativos o de difusión cultural, por favor contacte directamente con el autor para obtener el permiso correspondiente.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-xl mb-4 uppercase tracking-widest">3. Responsabilidad</h2>
              <p>
                El autor no se hace responsable de los errores u omisiones en los contenidos de este sitio web, ni de los daños que pudieran derivarse de la utilización de la información aquí contenida. Los enlaces a sitios externos se proporcionan únicamente para conveniencia del usuario y no implican aprobación del contenido de dichos sitios.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-xl mb-4 uppercase tracking-widest">4. Protección de Datos</h2>
              <p>
                Este sitio web no recopila datos personales de los usuarios de forma automatizada, salvo aquellos que el usuario decida proporcionar voluntariamente a través de los canales de contacto indicados.
              </p>
            </section>

            <div className="pt-12 border-t border-white/10 text-xs uppercase tracking-[0.3em] text-white/40">
              © 2026 Carlos González Saavedra — Todos los derechos reservados.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
