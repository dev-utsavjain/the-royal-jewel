import { Check, Users, History, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSection } from '../lib/content';

interface Value { title: string; desc: string; }
interface Stat { number: string; label: string; }

export default function AboutUs() {
  const c = useSection('about');
  const values = (c.values as Value[]) || [];
  const stats = (c.stats as Stat[]) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 bg-white">
      <Helmet>
        <title>About Us | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content="Discover the rich heritage and exceptional hospitality of Hotel The Royal Jewel in Hisar. A vision of modern elegance and uncompromising quality." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-black text-white px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src={c.heroImage as string}
            alt="Hotel Exterior"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">{c.heroHeading as string}</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            {c.heroSubtitle as string}
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-4">
              {c.storyEyebrow as string}
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl text-gray-900 font-bold mb-6">
              {c.storyHeading as string}
            </h3>
            <p className="text-gray-600 font-light leading-relaxed mb-6 text-lg">
              {c.paragraph1 as string}
            </p>
            <p className="text-gray-600 font-light leading-relaxed mb-8 text-lg">
              {c.paragraph2 as string}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center shrink-0">
                  <History className="text-gold-500" size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-gray-900 mb-1">{c.highlight1Title as string}</h4>
                  <p className="text-gray-500 text-sm font-light">{c.highlight1Text as string}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center shrink-0">
                  <Users className="text-gold-500" size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-gray-900 mb-1">{c.highlight2Title as string}</h4>
                  <p className="text-gray-500 text-sm font-light">{c.highlight2Text as string}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden">
              <img
                src={c.sideImage as string}
                alt="Hotel Reception"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 border border-gray-100 shadow-xl hidden md:block">
              <div className="font-serif text-5xl text-gold-500 font-bold mb-2">{c.badgeNumber as string}</div>
              <div className="text-gray-500 uppercase tracking-widest text-xs font-semibold">{c.badgeLabel as string}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-4">
              {c.valuesEyebrow as string}
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl text-gray-900 font-bold">
              {c.valuesHeading as string}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center mb-6">
                  <Check className="text-gold-500" size={24} />
                </div>
                <h4 className="font-serif text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600 font-light leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats/Awards */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto bg-black text-white p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src={c.awardsImage as string}
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <Trophy className="text-gold-500 mx-auto mb-6" size={48} />
            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-8">{c.awardsHeading as string}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="font-serif text-4xl md:text-5xl text-gold-500 mb-2">{s.number}</div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
