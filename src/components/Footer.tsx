import { Instagram, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="space-y-6">
          <h3 className="font-serif text-2xl tracking-widest uppercase">CGS</h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Dedicado a documentar la belleza de los rincones más remotos del planeta a través de una mirada honesta y cinematográfica.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">Contacto</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <Mail size={16} /> hola@carlosgs.com
            </li>
            <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <Instagram size={16} /> @carlosgs_photo
            </li>
            <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <Twitter size={16} /> @carlosgs_travel
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">Newsletter</h4>
          <p className="text-white/40 text-xs">Recibe mis últimas reseñas y consejos de fotografía directamente en tu correo.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-white/5 border border-white/10 px-4 py-2 text-sm w-full focus:outline-none focus:border-gold transition-colors"
            />
            <button className="bg-gold text-black px-6 py-2 text-xs uppercase font-bold hover:bg-white transition-colors">
              Unirse
            </button>
          </div>
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
