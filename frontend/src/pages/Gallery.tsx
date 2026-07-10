import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSection } from '../lib/content';

export default function GalleryPage() {
  const c = useSection('galleryPage');
  const allGalleryImages = ((c.images as { url: string }[]) || []).map((x) => x.url);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <Helmet>
        <title>Gallery | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content="Take a visual tour of Hotel The Royal Jewel. View our luxury rooms, exquisite dining options, and stunning rooftop experiences." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src={c.heroImage as string}
            alt="Gallery Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
            {c.heading as string}
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            {c.subtitle as string}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGalleryImages.map((src, index) => (
              <div 
                key={index} 
                className={`relative group overflow-hidden rounded-xl shadow-md ${
                  index % 5 === 0 ? 'md:col-span-2 lg:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
                }`}
              >
                <img 
                  src={src} 
                  alt={`Gallery Image ${index + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
