import React from 'react';
import { motion } from 'motion/react';
import { Camera, Map, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { name: 'Inicio', path: '/', id: 'inicio' },
    { name: 'Viajes', path: '/#viajes', id: 'viajes' },
    { name: 'Galería', path: '/#galeria', id: 'galeria' },
    { name: 'El Autor', path: '/#el-autor', id: 'el-autor' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[120] px-6 py-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Camera className="w-6 h-6 text-gold" />
            <span className="font-serif text-xl tracking-widest uppercase">CGS</span>
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {isHome ? (
                <a
                  href={`#${item.id}`}
                  className="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  to={item.path}
                  className="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 p-8 flex flex-col gap-6 items-center"
        >
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              {isHome ? (
                <a
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      )}
    </nav>
  );
};
