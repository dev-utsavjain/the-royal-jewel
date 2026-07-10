import { Check, Info, Maximize, Wind, Wifi, Tv, Coffee } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Room, listRooms } from '../lib/api';
import { useSection } from '../lib/content';

// Map CMS icon keys to lucide icons; unknown keys fall back to a check mark.
const iconFor = (key: string) => {
  const size = 18;
  switch (key) {
    case 'wind': return <Wind size={size} />;
    case 'wifi': return <Wifi size={size} />;
    case 'tv': return <Tv size={size} />;
    case 'coffee': return <Coffee size={size} />;
    default: return <Check size={size} />;
  }
};

function RoomGallery({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="aspect-video w-full rounded-xl overflow-hidden shadow-sm"
        >
          <img src={images[activeImage]} alt="Room View" className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const location = useLocation();
  const c = useSection('roomsPage');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listRooms()
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, rooms]);

  return (
    <div className="pt-24 bg-white">
      <Helmet>
        <title>Rooms & Suites | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content="Explore our luxurious rooms and suites at Hotel The Royal Jewel. From Deluxe to Royal Suites, experience comfort tailored for you." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-black text-white px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src={c.heroImage as string}
            alt="Luxury Rooms"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">{c.heading as string}</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            {c.subtitle as string}
          </p>
        </div>
      </section>

      {/* Rooms List */}
      <div className="max-w-7xl mx-auto py-16 md:py-20 px-6 md:px-12 space-y-20 md:space-y-32">
        {loading && <p className="text-center text-gray-500">Loading rooms…</p>}
        {!loading && error && <p className="text-center text-gray-500">Unable to load rooms right now.</p>}
        {!loading && !error && rooms.length === 0 && <p className="text-center text-gray-500">No rooms available at the moment.</p>}

        {rooms.map((room, index) => (
          <section key={room.slug} id={room.slug} className="scroll-mt-32">
            <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-start`}>

              {/* Left/Right Column: Image Gallery */}
              <div className="w-full lg:w-1/2">
                {(() => {
                  const imgs = (room.gallery.length ? room.gallery : [room.mainImage]).filter(Boolean);
                  return imgs.length ? (
                    <RoomGallery images={imgs} />
                  ) : (
                    <div className="aspect-video w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  );
                })()}
              </div>

              {/* Left/Right Column: Room Info */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">{room.name}</h2>
                <div className="text-gold-500 font-medium tracking-wide text-xl mb-6">{room.price}</div>

                <p className="text-gray-600 font-light leading-relaxed text-lg mb-8">
                  {room.details}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8 border-y border-gray-100 py-8">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Room Size</div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <Maximize size={16} className="text-gold-500" /> {room.size}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Bed Type</div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                       {room.bedType}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Max Occupancy</div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                       {room.occupancy}
                    </div>
                  </div>
                </div>

                {/* Amenities & Features */}
                <div className="mb-10">
                  <h3 className="font-serif text-2xl font-semibold mb-6">Room Amenities</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-700 font-light">
                        <span className="text-gold-500 bg-gold-50 p-2 rounded-full">{iconFor(amenity.icon)}</span>
                        {amenity.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="font-serif text-2xl font-semibold mb-6">Additional Features</h3>
                  <ul className="space-y-3">
                    {room.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start text-gray-600 font-light">
                        <Check size={20} className="text-gold-500 mr-3 shrink-0 mt-0.5" strokeWidth={2} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/book?room=${room.slug}`} className="px-8 py-4 bg-gold-500 text-white hover:bg-gold-600 transition-colors duration-300 uppercase tracking-widest text-sm font-semibold flex-1 text-center">
                    Book This Room
                  </Link>
                  <Link to="/contact?subject=Room%20Reservation" className="px-8 py-4 border border-gray-300 text-gray-700 hover:border-gold-500 hover:text-gold-500 transition-colors duration-300 uppercase tracking-widest text-sm font-semibold flex items-center justify-center gap-2 flex-1">
                    <Info size={18} /> Enquire
                  </Link>
                </div>

              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
