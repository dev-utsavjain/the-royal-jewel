import { Utensils, Music, GlassWater, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function RooftopPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 bg-dark-900 text-white min-h-screen">
      <Helmet>
        <title>Rooftop Restaurant | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content="Dine above the city at our premier rooftop restaurant in Hisar. Enjoy fine dining, crafted cocktails, and breathtaking sunset views." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-black px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
            alt="Rooftop Dining" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gold-500"></div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">The Crown Jewel</span>
            <div className="h-[1px] w-8 bg-gold-500"></div>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white">
            Elevated Experiences
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            Discover Hisar's premier rooftop destination. Where panoramic city views meet exceptional culinary artistry.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Fine Dining Above the City
              </h2>
              <p className="text-gray-600 font-light text-lg leading-relaxed mb-8">
                Indulge in a curated menu of local delicacies and international cuisines, expertly crafted by our master chefs. Whether it's a romantic dinner under the stars or a celebratory feast with friends, our rooftop restaurant provides the perfect ambiance.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700 gap-3">
                  <Utensils className="text-gold-500" size={20} />
                  <span>Signature multi-cuisine menu</span>
                </li>
                <li className="flex items-center text-gray-700 gap-3">
                  <GlassWater className="text-gold-500" size={20} />
                  <span>Premium spirits and crafted mocktails</span>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl">
              <img 
                src="https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png" 
                alt="Rooftop Restaurant" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" 
                alt="Rooftop Events" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Unforgettable Events
              </h2>
              <p className="text-gray-600 font-light text-lg leading-relaxed mb-8">
                Transform your special occasions into magical memories. Our expansive rooftop can be customized for private parties, corporate gatherings, and intimate wedding receptions with the city skyline as your backdrop.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700 gap-3">
                  <Music className="text-gold-500" size={20} />
                  <span>Live music and entertainment options</span>
                </li>
                <li className="flex items-center text-gray-700 gap-3">
                  <Sparkles className="text-gold-500" size={20} />
                  <span>Customizable event layouts & decor</span>
                </li>
              </ul>
              <div className="mt-10">
                <Link to="/contact?subject=Events%20%26%20Weddings" className="inline-block px-8 py-4 bg-gold-500 text-white hover:bg-gold-600 transition-colors duration-300 uppercase tracking-widest text-sm font-semibold">
                  Inquire for Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambiance Highlights */}
      <section className="py-20 bg-white px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-16 text-gray-900">Experience the Magic</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-gold-500 mb-6 flex justify-center">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Sunset Views</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Watch the city transform as the sun dips below the horizon, painting the sky in vibrant hues.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-gold-500 mb-6 flex justify-center">
                <Music size={32} />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Weekend Vibes</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Enjoy curated playlists and occasional live acoustic performances that set the perfect mood.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-gold-500 mb-6 flex justify-center">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Culinary Excellence</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                A menu designed to tantalize your taste buds, featuring seasonal specials and timeless classics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
