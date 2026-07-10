import { MapPin, Phone, Clock } from 'lucide-react';
import { useSection } from '../lib/content';

export default function Location() {
  const c = useSection('location');
  const s = useSection('settings');
  return (
    <section id="location" className="py-20 md:py-32 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-8 bg-gold-500"></div>
                <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">{c.eyebrow as string}</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
                {c.heading as string}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="text-gold-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {c.addressLine1 as string}<br />
                    {c.addressLine2 as string}<br />
                    {c.addressLine3 as string}
                  </p>
                  <p className="text-gold-500 text-sm mt-2 font-medium">{c.nearby as string}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-gold-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600 font-light">
                    <a href={`tel:${s.phoneTel}`} className="hover:text-gold-500 transition-colors">{s.phoneDisplay as string}</a><br />
                    <a href={`mailto:${s.email}`} className="hover:text-gold-500 transition-colors break-all">{s.email as string}</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="text-gold-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Check In / Out</h3>
                  <p className="text-gray-600 font-light">
                    Check-in: {c.checkIn as string}<br />
                    Check-out: {c.checkOut as string}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={c.directionsUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 uppercase tracking-wider text-sm font-medium transition-colors"
            >
              Get Directions
            </a>
          </div>

          {/* Right Column - Map */}
          <div className="bg-white border border-gray-200 h-[400px] lg:h-auto min-h-[500px] w-full overflow-hidden">
             <iframe
               src={c.mapEmbed as string}
               width="100%"
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen={true} 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="w-full h-full"
             ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
}
