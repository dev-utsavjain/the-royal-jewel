import { Link } from 'react-router-dom';
import { useSection } from '../lib/content';

interface Stat { number: string; label: string; }

export default function Story() {
  const c = useSection('story');
  const stats = (c.stats as Stat[]) || [];
  return (
    <section id="about" className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        
        {/* Image Side */}
        <div className="relative">
          <div className="aspect-[3/4] md:aspect-auto md:h-[600px] w-full overflow-hidden">
            <img
              src={c.image as string}
              alt="Hotel Lobby"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative frame - optional, left out for clean modern look or added as a border */}
          <div className="absolute -inset-4 border border-gold-500/20 -z-10 hidden md:block"></div>
        </div>

        {/* Text Side */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gold-500"></div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">{c.eyebrow as string}</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {c.heading as string}
          </h2>

          <div className="space-y-6 text-gray-600 font-light leading-relaxed">
            <p>{c.paragraph1 as string}</p>
            <p>{c.paragraph2 as string}</p>
          </div>

          <div className="pt-2">
            <Link to="/about" className="inline-block border-b-2 border-gold-500 text-gray-900 pb-1 font-medium tracking-wide hover:text-gold-500 transition-colors">
              Discover Our Heritage
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="font-serif text-3xl text-gold-500 mb-1">{s.number}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
