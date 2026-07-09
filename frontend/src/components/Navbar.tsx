import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/rooftop', label: 'Rooftop' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location]);

  const isHome = location.pathname === '/';
  const solid = isScrolled || !isHome || menuOpen;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${
      solid ? 'bg-white text-gray-900 shadow-md py-4' : 'bg-transparent text-white py-6'
    }`}>
      <Link to="/" className="font-serif text-2xl font-bold tracking-wider">
        The Royal Jewel
      </Link>

      <div className={`hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium ${solid ? 'text-gray-700' : 'text-white'}`}>
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} className="hover:text-gold-500 transition-colors">{l.label}</Link>
        ))}
      </div>

      <div className="hidden md:block">
        <Link to="/book" className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 uppercase tracking-wider text-sm font-medium transition-colors">
          Book Now
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        className={`md:hidden p-2.5 -mr-1.5 ${solid ? 'text-gray-900' : 'text-white'}`}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white text-gray-900 shadow-lg flex flex-col px-6 py-4 border-t border-gray-100">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="py-3 text-sm uppercase tracking-widest font-medium text-gray-700 hover:text-gold-500 transition-colors border-b border-gray-50 last:border-0">
              {l.label}
            </Link>
          ))}
          <Link to="/book" className="mt-4 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 uppercase tracking-wider text-sm font-medium transition-colors text-center">
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
