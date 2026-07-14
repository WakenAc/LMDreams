import { useState, useEffect } from 'react';
import { FaPhone, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';

const NAV_ITEMS = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre nós', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Método de trabalho', href: '#metodo' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contactos', href: '#contactos' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-3 text-decoration-none group shrink-0"
          >
            <img
              src="/logo-lmdreams.png"
              alt="LMDreams - Construção Civil"
              className="h-10 w-auto md:h-12"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-500 text-brand-700 hover:text-accent-600 transition-colors duration-200 no-underline"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contactos"
              className="btn btn-primary text-sm px-5 py-2.5"
            >
              Pedir orçamento
            </a>
          </nav>

          {/* Mobile contact + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href="#contactos"
              className="btn btn-primary text-sm px-4 py-2"
            >
              Pedir orçamento
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brand-800 hover:text-accent-600 transition-colors"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile nav */}
      <nav
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Navegação móvel"
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-brand-800 hover:text-accent-600 transition-colors"
            aria-label="Fechar menu"
          >
            <FaTimes size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-1 px-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="py-3 text-base font-500 text-brand-700 hover:text-accent-600 transition-colors no-underline border-b border-brand-100"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-6">
            <a
              href="#contactos"
              onClick={handleNavClick}
              className="btn btn-primary w-full justify-center"
            >
              Pedir orçamento
            </a>
            <div className="flex gap-3 mt-2">
              <a
                href="tel:+351919233372"
                className="flex-1 btn btn-outline text-sm justify-center gap-2 py-2.5"
                aria-label="Ligar"
              >
                <FaPhone size={14} />
                Ligar
              </a>
              <a
                href="https://wa.me/351919233372"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn btn-outline text-sm justify-center gap-2 py-2.5"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={14} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
