import { Wifi, Car, Wind, UtensilsCrossed, Tv, Users, Sparkles, Coffee, Utensils, BellRing } from 'lucide-react';

const amenities = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Car, label: "Free Parking" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: UtensilsCrossed, label: "Room Service" },
  { icon: Tv, label: "Smart TV" },
  { icon: Users, label: "Family Rooms" },
  { icon: Sparkles, label: "Daily Housekeeping" },
  { icon: Coffee, label: "Rooftop Lounge" },
  { icon: Utensils, label: "Restaurant" },
  { icon: BellRing, label: "24/7 Reception" }
];

export default function Amenities() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-100 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-8 bg-gold-500"></div>
              <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">Facilities</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
              Modern Amenities
            </h2>
          </div>
          <p className="text-gray-500 font-light text-sm md:text-base">
            Everything you need for a comfortable, unhurried stay.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-6">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-gold-50 group-hover:border-gold-200 transition-colors duration-300">
                  <Icon className="text-gray-600 group-hover:text-gold-500 transition-colors duration-300" size={24} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
