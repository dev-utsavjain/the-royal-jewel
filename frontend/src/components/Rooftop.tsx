import { Link } from 'react-router-dom';
import { useSection } from '../lib/content';

export default function Rooftop() {
  const c = useSection('rooftopHome');
  return (
    <section id="rooftop" className="py-20 md:py-32 px-6 md:px-12 bg-dark-800 text-white text-center">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gold-500"></div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">{c.eyebrow as string}</span>
            <div className="h-[1px] w-8 bg-gold-500"></div>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {c.heading as string}
          </h2>
          <p className="mt-8 text-gray-300 max-w-3xl text-lg md:text-xl font-light italic leading-relaxed">
            "{c.quote as string}"
          </p>
          <div className="mt-8">
            <Link to="/rooftop" className="inline-block border-b-2 border-gold-500 text-white pb-1 font-medium tracking-wide hover:text-gold-500 transition-colors">
              Explore Our Rooftop
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="aspect-square md:aspect-[4/5] overflow-hidden">
            <img
              src={c.image1 as string}
              alt="Rooftop Dining Table Setup"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="aspect-video md:aspect-square lg:aspect-[4/3] overflow-hidden md:mt-20">
            <img
              src={c.image2 as string}
              alt="Rooftop Event Setup"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
