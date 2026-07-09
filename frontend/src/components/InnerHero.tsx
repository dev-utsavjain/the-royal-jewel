interface InnerHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

// Shared dark hero band for inner pages (matches About/Rooms/Contact).
export default function InnerHero({ title, subtitle, image }: InnerHeroProps) {
  const bg = image || 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782799643/room_xenwzf.png';
  return (
    <section className="relative py-20 md:py-28 bg-black text-white px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <img src={bg} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
