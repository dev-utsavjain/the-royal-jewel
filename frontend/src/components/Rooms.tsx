import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const rooms = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    price: "From Rs. 2,328 / night",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
    description: "Warm and comfortable standard accommodation.",
    features: [
      "Queen-size bed",
      "Air Conditioning",
      "Smart TV",
      "High-speed WiFi"
    ]
  },
  {
    id: "premium",
    name: "Premium Room",
    price: "From Rs. 3,500 / night",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
    description: "Elegant workspace and spacious interiors.",
    features: [
      "Spacious interiors",
      "Work desk",
      "Modern bathroom",
      "Complimentary breakfast"
    ]
  },
  {
    id: "royal",
    name: "Royal Suite",
    price: "From Rs. 6,500 / night",
    image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop",
    description: "Our finest accommodation for a luxurious stay.",
    features: [
      "Luxury furnishings",
      "Rooftop views",
      "Premium amenities",
      "Separate living area"
    ]
  }
];

export default function Rooms() {
  return (
    <section id="rooms" className="py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gold-500"></div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-medium">Accommodations</span>
            <div className="h-[1px] w-8 bg-gold-500"></div>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">
            Stay in Luxury
          </h2>
          <p className="mt-6 text-gray-600 max-w-2xl font-light">
            Rest in beautifully appointed rooms featuring warm ambient lighting, premium bedding, and every modern convenience.
          </p>
          <div className="mt-6">
            <Link to="/rooms" className="inline-block border-b-2 border-gold-500 text-gray-900 pb-1 font-medium tracking-wide hover:text-gold-500 transition-colors">
              View All Accommodations
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div key={index} className="group border border-gray-100 flex flex-col hover:shadow-2xl transition-shadow duration-500 bg-white">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-serif text-2xl font-semibold">{room.name}</h3>
                  <p className="text-gold-500 font-medium tracking-wide text-sm mt-1">{room.price}</p>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-gray-600 font-light text-sm mb-6 pb-6 border-b border-gray-100">
                  {room.description}
                </p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {room.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm text-gray-500 font-light">
                      <Check size={16} className="text-gold-500 mr-3 shrink-0" strokeWidth={2} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to={`/rooms#${room.id}`} className="block text-center w-full py-3 border border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white transition-colors duration-300 uppercase tracking-widest text-xs font-semibold">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
