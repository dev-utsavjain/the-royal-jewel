import { Star, MapPin, Wifi, Car, Users, Clock, Coffee, Gem } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: "Best Rooftop Experience",
    description: "Sunset dining above the city skyline."
  },
  {
    icon: MapPin,
    title: "Prime Location in Hisar",
    description: "Conveniently located in Sector 13."
  },
  {
    icon: Wifi,
    title: "Free High-Speed WiFi",
    description: "Stay connected throughout your visit."
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Secure and convenient on-site parking."
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "Environment perfect for family stays."
  },
  {
    icon: Clock,
    title: "24/7 Front Desk",
    description: "Round-the-clock support for all needs."
  },
  {
    icon: Coffee,
    title: "Premium Room Service",
    description: "Exceptional dining delivered to your door."
  },
  {
    icon: Gem,
    title: "Affordable Luxury",
    description: "Premium experience without the premium price."
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gold-500"></div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">Why Choose Us</span>
            <div className="h-[1px] w-8 bg-gold-500"></div>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
            The Royal Jewel Difference
          </h2>
          <p className="mt-6 text-gray-600 max-w-2xl font-light">
            Experience unparalleled comfort and convenience with our carefully curated amenities designed for the modern traveler.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-4 md:p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold-50 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                  <Icon className="text-gold-500 group-hover:text-white transition-colors duration-300 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-sm md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
