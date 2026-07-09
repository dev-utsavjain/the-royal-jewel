import { Phone, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center text-center py-24 md:py-32">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png")' }}
      ></div>
      {/* Overlay for contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
      
      <div className="relative z-10 flex flex-col items-center px-4 max-w-4xl mx-auto mt-8">
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-wrap items-center justify-center gap-y-1 max-w-full space-x-1 mb-6 text-gold-500 bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 sm:px-6 py-2.5 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
          <span className="text-white text-sm ml-2 tracking-wide font-medium">4.9 Stars (241+ Reviews)</span>
        </motion.div>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight mb-4 drop-shadow-lg">
          Experience Luxury and Comfort at Hotel The Royal Jewel
        </h1>
        
        <p className="text-gray-200 text-lg font-light tracking-wide mb-10 drop-shadow">
          Hisar's Premier Rooftop Hotel with Exceptional Hospitality
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/book" className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 uppercase tracking-wider text-sm font-medium transition-colors text-center">
            Book Now
          </Link>
          <Link to="/rooms" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-3 uppercase tracking-wider text-sm font-medium transition-colors border border-white/20 text-center">
            View Rooms
          </Link>
          <a href="tel:+919930871000" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-3 uppercase tracking-wider text-sm font-medium transition-colors border border-white/20 flex items-center justify-center gap-2">
            <Phone size={16} />
            Call Us
          </a>
        </div>
      </div>
    </section>
  );
}
