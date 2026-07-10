import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSection } from '../lib/content';

export default function Footer() {
  const s = useSection('settings');
  return (
    <footer className="bg-black text-white py-16 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dm3scoj2q/image/upload/v1783511410/ChatGPT_Image_Jul_8_2026_04_56_54_PM_fpbf68.png"
                alt="The Royal Jewel"
                className="h-12 w-12 object-contain shrink-0"
              />
              <div className="font-serif text-3xl font-bold tracking-wider text-gold-500">
                The Royal Jewel
              </div>
            </div>
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              {s.brandBlurb as string}
            </p>
            <div className="flex space-x-2">
              <a href={s.facebook as string} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2.5 -m-0.5 inline-flex text-gray-400 hover:text-gold-500 transition-colors"><Facebook size={20} /></a>
              <a href={s.instagram as string} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2.5 -m-0.5 inline-flex text-gray-400 hover:text-gold-500 transition-colors"><Instagram size={20} /></a>
              <a href={s.twitter as string} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2.5 -m-0.5 inline-flex text-gray-400 hover:text-gold-500 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-6 text-white">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Our Story</Link></li>
              <li><Link to="/rooms" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Accommodations</Link></li>
              <li><Link to="/rooftop" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Rooftop Experience</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Gallery</Link></li>
            </ul>
          </div>

          {/* CMS / Legal */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">FAQs</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Terms &amp; Conditions</Link></li>
              <li><Link to="/cancellation" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Cancellation Policy</Link></li>
              <li><Link to="/admin" className="text-gray-400 hover:text-gold-500 transition-colors text-sm font-light">Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-6 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm font-light leading-relaxed">
                  {s.address as string}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold-500 shrink-0" />
                <a href={`tel:${s.phoneTel}`} className="text-gray-400 text-sm font-light hover:text-gold-500 transition-colors">{s.phoneDisplay as string}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold-500 shrink-0" />
                <a href={`mailto:${s.email}`} className="text-gray-400 text-sm font-light hover:text-gold-500 transition-colors break-all">{s.email as string}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center text-center gap-2">
          <p className="text-gray-500 text-sm font-light">
            © {new Date().getFullYear()} Hotel The Royal Jewel. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm font-light">
            Designed with{' '}
            <a href="https://imagine.bo" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600 transition-colors font-medium">
              imagine.bo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
