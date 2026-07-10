import { Link } from 'react-router-dom';
import { useSection } from '../lib/content';

export default function Gallery() {
  const c = useSection('homeGallery');
  const galleryImages = ((c.images as { url: string }[]) || []).map((x) => x.url);
  return (
    <section id="gallery" className="py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gold-500"></div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">{c.eyebrow as string}</span>
            <div className="h-[1px] w-8 bg-gold-500"></div>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
            {c.heading as string}
          </h2>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Large main image */}
          <div className="col-span-2 row-span-2 relative group overflow-hidden">
            <img src={galleryImages[0]} alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          
          <div className="col-span-2 row-span-1 relative group overflow-hidden">
            <img src={galleryImages[1]} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src={galleryImages[2]} alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src={galleryImages[3]} alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src={galleryImages[4]} alt="Gallery 5" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src={galleryImages[6]} alt="Gallery 6" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>

          <div className="col-span-2 row-span-1 relative group overflow-hidden">
            <img src={galleryImages[5]} alt="Gallery 7" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/gallery" className="inline-block border-b-2 border-gold-500 text-gray-900 pb-1 font-medium tracking-wide hover:text-gold-500 transition-colors">
            View Full Gallery
          </Link>
        </div>

      </div>
    </section>
  );
}
