import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Story from '../components/Story';
import Features from '../components/Features';
import Rooms from '../components/Rooms';
import Rooftop from '../components/Rooftop';
import Amenities from '../components/Amenities';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import Location from '../components/Location';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Hotel The Royal Jewel | Luxury Hotel in Hisar</title>
        <meta name="description" content="Discover unparalleled luxury at Hotel The Royal Jewel in Hisar. Enjoy premium rooms, an exquisite rooftop dining experience, and world-class amenities." />
      </Helmet>
      <Hero />
      <Story />
      <Features />
      <Rooms />
      <Rooftop />
      <Amenities />
      <Testimonials />
      <Gallery />
      <Location />
    </>
  );
}
