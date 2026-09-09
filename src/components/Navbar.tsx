import React from 'react';
import { motion } from 'motion/react';
import { Camera, Map, Menu, X, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const lastScrollYRef = React.useRef(0);
  const location = useLocation();
  const isHome = location.pathname === '/';

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Background and blur logic
      setScrolled(currentScrollY > 50);

      // Hide/Show logic
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        // Scrolling down - hide
        setVisible(false);
      } else {
        // Scrolling up - show
        setVisible(true);
      }
      
      lastScrollYRef.current = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', path: '/', id: 'inicio', isPage: true },
    { name: 'Viajes', path: '/#viajes', id: 'viajes', isPage: false },
    { name: 'Galería', path: '/#galeria', id: 'galeria', isPage: false },
    { name: 'Explorar', path: '/explorar', id: 'explorar', isPage: true },
    { name: 'El Autor', path: '/#el-autor', id: 'el-autor', isPage: false }
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isHashLink = !item.isPage;
    
    if (isHome && isHashLink) {
      return (
        <a
          href={`#${item.id}`}
          className="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors"
        >
          {item.name}
        </a>
      );
    }

    return (
      <Link
        to={item.path}
        className="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors"
      >
        {item.name}
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-500 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled 
          ? 'py-4 bg-black/80 backdrop-blur-lg border-b border-white/5 shadow-2xl' 
          : 'py-8 bg-transparent'
      } px-6`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 group"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              {isHome ? (
                <Camera className="w-6 h-6 text-gold" />
              ) : (
                <ArrowLeft className="w-6 h-6 text-gold group-hover:-translate-x-1 transition-transform" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-widest uppercase leading-none">CGS</span>
              {!isHome && (
                <span className="text-[8px] uppercase tracking-[0.3em] text-gold/60 mt-1 leading-none">Volver</span>
              )}
            </div>
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
              <NavLink item={item} />
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
            <div key={item.id} onClick={() => setIsOpen(false)}>
              <NavLink item={item} />
            </div>
          ))}
        </motion.div>
      )}
    </nav>
  );
};
