import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const allGalleryImages = [
  "https://res.cloudinary.com/dm3scoj2q/image/upload/v1782799643/room_xenwzf.png", // Exterior
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop", // Lobby
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop", // Room 1
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop", // Room 2
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop", // Dining 1
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop", // Dining 2
  "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop", // Suite
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop", // Extra Room
  "https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png", // Rooftop
];

export default function GalleryPage() {
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
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" 
            alt="Gallery Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            Take a visual tour of Hotel The Royal Jewel. From luxurious accommodations to our stunning rooftop experiences.
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
