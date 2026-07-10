import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSection, iconFor } from '../lib/content';

interface Bullet { icon: string; text: string; }
interface Card { icon: string; title: string; description: string; }

export default function RooftopPage() {
  const c = useSection('rooftopPage');
  const block1Bullets = (c.block1Bullets as Bullet[]) || [];
  const block2Bullets = (c.block2Bullets as Bullet[]) || [];
  const ambiance = (c.ambiance as Card[]) || [];

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
            src={c.heroImage as string}
            alt="Rooftop Dining"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gold-500"></div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">{c.heroEyebrow as string}</span>
            <div className="h-[1px] w-8 bg-gold-500"></div>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white">
            {c.heroHeading as string}
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            {c.heroSubtitle as string}
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                {c.block1Heading as string}
              </h2>
              <p className="text-gray-600 font-light text-lg leading-relaxed mb-8">
                {c.block1Text as string}
              </p>
              <ul className="space-y-4">
                {block1Bullets.map((b, i) => {
                  const Icon = iconFor(b.icon);
                  return (
                    <li key={i} className="flex items-center text-gray-700 gap-3">
                      <Icon className="text-gold-500" size={20} />
                      <span>{b.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="order-1 md:order-2 aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl">
              <img
                src={c.block1Image as string}
                alt="Rooftop Restaurant"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl">
              <img
                src={c.block2Image as string}
                alt="Rooftop Events"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                {c.block2Heading as string}
              </h2>
              <p className="text-gray-600 font-light text-lg leading-relaxed mb-8">
                {c.block2Text as string}
              </p>
              <ul className="space-y-4">
                {block2Bullets.map((b, i) => {
                  const Icon = iconFor(b.icon);
                  return (
                    <li key={i} className="flex items-center text-gray-700 gap-3">
                      <Icon className="text-gold-500" size={20} />
                      <span>{b.text}</span>
                    </li>
                  );
                })}
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
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-16 text-gray-900">{c.ambianceHeading as string}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ambiance.map((card, i) => {
              const Icon = iconFor(card.icon);
              return (
                <div key={i} className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="text-gold-500 mb-6 flex justify-center">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">{card.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
