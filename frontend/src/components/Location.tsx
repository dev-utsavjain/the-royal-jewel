import { MapPin, Phone, Clock } from 'lucide-react';

export default function Location() {
  return (
    <section id="location" className="py-20 md:py-32 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-8 bg-gold-500"></div>
                <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">Location</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
                Find Us in Hisar
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="text-gold-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Over Bridge, Old Radha Swami Satsang Complex,<br />
                    Near Shanti Devi Hospital, Sector 13,<br />
                    Hisar, Haryana 125005
                  </p>
                  <p className="text-gold-500 text-sm mt-2 font-medium">Nearby: Dabra Chowk, Shanti Devi Hospital</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-gold-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600 font-light">
                    <a href="tel:+919930871000" className="hover:text-gold-500 transition-colors">+91 99308 71000</a><br />
                    <a href="mailto:info@hoteltheroyaljewel.com" className="hover:text-gold-500 transition-colors break-all">info@hoteltheroyaljewel.com</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="text-gold-500 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Check In / Out</h3>
                  <p className="text-gray-600 font-light">
                    Check-in: 2:00 PM<br />
                    Check-out: 11:00 AM
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Hotel+The+Royal+Jewel,+Sector+13,+Hisar,+Haryana+125005"
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
               src="https://maps.google.com/maps?q=Hotel+The+Royal+Jewel,+Sector+13,+Hisar,+Haryana&t=&z=15&ie=UTF8&iwloc=&output=embed" 
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
