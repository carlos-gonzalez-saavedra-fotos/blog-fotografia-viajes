import { Instagram, Youtube, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="space-y-6">
          <h3 className="font-serif text-2xl tracking-widest uppercase">CGS</h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Una mirada entregada a la quietud contemplativa de un teatro abierto, donde la vida misma es el espectáculo más cautivador.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">Cuentas</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li>
              <a 
                href="http://www.youtube.com/@cgsaavedra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Youtube size={16} /> @cgsaavedra
              </a>
            </li>
            <li>
              <a 
                href="https://www.instagram.com/cg.saavedra/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Instagram size={16} /> cg.saavedra
              </a>
            </li>
            <li>
              <a 
                href="https://www.linkedin.com/in/carlos-gonzalez-saavedra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-white/20">
        <p>© 2026 Carlos González Saavedra. Todos los derechos reservados.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacidad</a>
          <a href="#" className="hover:text-white">Términos</a>
        </div>
      </div>
    </footer>
  );
};
