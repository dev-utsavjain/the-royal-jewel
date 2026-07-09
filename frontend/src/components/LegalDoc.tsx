import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import InnerHero from './InnerHero';

export interface Section {
  heading: string;
  body: string[]; // each string is a paragraph
}

interface LegalDocProps {
  title: string;
  subtitle: string;
  updated: string;
  sections: Section[];
  metaDescription: string;
}

export default function LegalDoc({ title, subtitle, updated, sections, metaDescription }: LegalDocProps) {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <Helmet>
        <title>{title} | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <InnerHero title={title} subtitle={subtitle} />

      <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-10">Last updated: {updated}</p>
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">{s.heading}</h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-gray-600 font-light leading-relaxed mb-4 text-base md:text-lg">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
