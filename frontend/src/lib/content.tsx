/**
 * Site content system.
 *
 * A single schema (SECTIONS) defines every editable piece of site content: its
 * field types, labels, and DEFAULT values (the original hardcoded copy/images).
 * The same schema is used two ways:
 *   1. Public site — <ContentProvider> fetches GET /api/content and deep-merges
 *      stored values over these defaults; components read via useSection().
 *   2. Admin — pages/AdminContent.tsx renders an editor form from this schema.
 *
 * An unset section (or field) simply falls back to its default, so the site looks
 * identical until an admin changes something.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  Star, MapPin, Wifi, Car, Users, Clock, Coffee, Gem, Wind, Tv,
  UtensilsCrossed, Sparkles, Utensils, BellRing, Phone, Mail, Check,
  GlassWater, Music,
  type LucideIcon,
} from 'lucide-react';
import { getContent } from './api';

// --- Icon registry -------------------------------------------------------
// Icon-bearing collections (features, amenities) store a string key; this maps
// it to a lucide component. Mirrors the pattern already used for room amenities.
export const ICONS: Record<string, LucideIcon> = {
  star: Star, mapPin: MapPin, wifi: Wifi, car: Car, users: Users, clock: Clock,
  coffee: Coffee, gem: Gem, wind: Wind, tv: Tv, utensilsCrossed: UtensilsCrossed,
  sparkles: Sparkles, utensils: Utensils, bellRing: BellRing, phone: Phone,
  mail: Mail, check: Check, glassWater: GlassWater, music: Music,
};
export const ICON_KEYS = Object.keys(ICONS);
export const iconFor = (key: string): LucideIcon => ICONS[key] || Check;

// --- Schema types --------------------------------------------------------
export type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'icon' | 'list';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  default?: unknown;
  itemFields?: FieldSpec[]; // for type 'list'
  itemLabel?: string;       // singular noun for list add button, e.g. "testimonial"
}

export interface SectionSpec {
  key: string;   // backend section name
  title: string; // admin heading
  blurb?: string;
  fields: FieldSpec[];
}

// --- Section schema + defaults ------------------------------------------
export const SECTIONS: SectionSpec[] = [
  {
    key: 'settings',
    title: 'Global Settings',
    blurb: 'Contact details and social links used across the footer and site.',
    fields: [
      { key: 'brandBlurb', label: 'Footer blurb', type: 'textarea', default: "Experience luxury and comfort at Hisar's premier rooftop hotel. Where exceptional hospitality meets modern elegance." },
      { key: 'phoneDisplay', label: 'Phone (display)', type: 'text', default: '+91 99308 71000' },
      { key: 'phoneTel', label: 'Phone (tel: link, digits only)', type: 'text', default: '+919930871000' },
      { key: 'email', label: 'Email', type: 'text', default: 'info@hoteltheroyaljewel.com' },
      { key: 'address', label: 'Address (footer, one line)', type: 'textarea', default: 'Sector 13, Near Shanti Devi Hospital, Hisar, Haryana 125005' },
      { key: 'facebook', label: 'Facebook URL', type: 'url', default: 'https://www.facebook.com/' },
      { key: 'instagram', label: 'Instagram URL', type: 'url', default: 'https://www.instagram.com/' },
      { key: 'twitter', label: 'Twitter URL', type: 'url', default: 'https://twitter.com/' },
    ],
  },
  {
    key: 'hero',
    title: 'Home — Hero',
    fields: [
      { key: 'backgroundImage', label: 'Background image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png' },
      { key: 'ratingText', label: 'Rating text', type: 'text', default: '4.9 Stars (241+ Reviews)' },
      { key: 'heading', label: 'Heading', type: 'textarea', default: 'Experience Luxury and Comfort at Hotel The Royal Jewel' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', default: "Hisar's Premier Rooftop Hotel with Exceptional Hospitality" },
    ],
  },
  {
    key: 'story',
    title: 'Home — Story',
    fields: [
      { key: 'image', label: 'Image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798481/rooftop-eve_sj9ejz.png' },
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Our Story' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'A Legacy of Exceptional Hospitality' },
      { key: 'paragraph1', label: 'Paragraph 1', type: 'textarea', default: 'Located in the heart of Hisar, Hotel The Royal Jewel offers premium accommodation where modern luxury meets heritage charm. Our newly restored property provides an unhurried, immaculate experience for families, business travelers, and special occasions.' },
      { key: 'paragraph2', label: 'Paragraph 2', type: 'textarea', default: 'From our grand marble lobby to our signature rooftop dining, every detail has been considered to ensure your stay is memorable. Enjoy breathtaking city views, exceptional service, and a quiet confidence that sets the tone for your visit.' },
      {
        key: 'stats', label: 'Stats', type: 'list', itemLabel: 'stat',
        itemFields: [
          { key: 'number', label: 'Number', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
        default: [
          { number: '2015', label: 'Established' },
          { number: '4.9', label: 'Star Rating' },
          { number: '241+', label: 'Happy Guests' },
        ],
      },
    ],
  },
  {
    key: 'features',
    title: 'Home — Why Choose Us',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Why Choose Us' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'The Royal Jewel Difference' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Experience unparalleled comfort and convenience with our carefully curated amenities designed for the modern traveler.' },
      {
        key: 'items', label: 'Feature cards', type: 'list', itemLabel: 'feature',
        itemFields: [
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
        ],
        default: [
          { icon: 'star', title: 'Best Rooftop Experience', description: 'Sunset dining above the city skyline.' },
          { icon: 'mapPin', title: 'Prime Location in Hisar', description: 'Conveniently located in Sector 13.' },
          { icon: 'wifi', title: 'Free High-Speed WiFi', description: 'Stay connected throughout your visit.' },
          { icon: 'car', title: 'Free Parking', description: 'Secure and convenient on-site parking.' },
          { icon: 'users', title: 'Family-Friendly', description: 'Environment perfect for family stays.' },
          { icon: 'clock', title: '24/7 Front Desk', description: 'Round-the-clock support for all needs.' },
          { icon: 'coffee', title: 'Premium Room Service', description: 'Exceptional dining delivered to your door.' },
          { icon: 'gem', title: 'Affordable Luxury', description: 'Premium experience without the premium price.' },
        ],
      },
    ],
  },
  {
    key: 'amenities',
    title: 'Home — Amenities',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Facilities' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'Modern Amenities' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', default: 'Everything you need for a comfortable, unhurried stay.' },
      {
        key: 'items', label: 'Amenities', type: 'list', itemLabel: 'amenity',
        itemFields: [
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
        default: [
          { icon: 'wifi', label: 'Free WiFi' },
          { icon: 'car', label: 'Free Parking' },
          { icon: 'wind', label: 'Air Conditioning' },
          { icon: 'utensilsCrossed', label: 'Room Service' },
          { icon: 'tv', label: 'Smart TV' },
          { icon: 'users', label: 'Family Rooms' },
          { icon: 'sparkles', label: 'Daily Housekeeping' },
          { icon: 'coffee', label: 'Rooftop Lounge' },
          { icon: 'utensils', label: 'Restaurant' },
          { icon: 'bellRing', label: '24/7 Reception' },
        ],
      },
    ],
  },
  {
    key: 'testimonials',
    title: 'Home — Testimonials',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Testimonials' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'Guest Experiences' },
      { key: 'ratingValue', label: 'Rating value', type: 'text', default: '4.9' },
      { key: 'reviewsText', label: 'Reviews caption', type: 'text', default: 'Based on 241+ Reviews' },
      {
        key: 'items', label: 'Testimonials', type: 'list', itemLabel: 'testimonial',
        itemFields: [
          { key: 'text', label: 'Quote', type: 'textarea' },
          { key: 'author', label: 'Author', type: 'text' },
        ],
        default: [
          { text: 'Excellent stay experience. Clean rooms and very cooperative staff.', author: 'Ramesh K.' },
          { text: 'Best rooftop hotel in Hisar. Great hospitality and location.', author: 'Priya S.' },
          { text: 'Affordable luxury with excellent services. Will visit again!', author: 'Anil M.' },
          { text: 'The rooftop dining was an unforgettable experience. Highly recommended.', author: 'Sunita R.' },
        ],
      },
    ],
  },
  {
    key: 'rooftopHome',
    title: 'Home — Rooftop teaser',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'The Crown Jewel' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'Rooftop Experience' },
      { key: 'quote', label: 'Quote', type: 'textarea', default: 'Enjoy breathtaking city views, delicious dining experiences, and memorable evenings at our exclusive rooftop space.' },
      { key: 'image1', label: 'Image 1', type: 'image', default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' },
      { key: 'image2', label: 'Image 2', type: 'image', default: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop' },
    ],
  },
  {
    key: 'homeGallery',
    title: 'Home — Gallery strip',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Gallery' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'A Glimpse of Grandeur' },
      {
        key: 'images', label: 'Images (first 7 shown)', type: 'list', itemLabel: 'image',
        itemFields: [{ key: 'url', label: 'Image', type: 'image' }],
        default: [
          { url: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782799643/room_xenwzf.png' },
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop' },
        ],
      },
    ],
  },
  {
    key: 'location',
    title: 'Home — Location',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Location' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'Find Us in Hisar' },
      { key: 'addressLine1', label: 'Address line 1', type: 'text', default: 'Over Bridge, Old Radha Swami Satsang Complex,' },
      { key: 'addressLine2', label: 'Address line 2', type: 'text', default: 'Near Shanti Devi Hospital, Sector 13,' },
      { key: 'addressLine3', label: 'Address line 3', type: 'text', default: 'Hisar, Haryana 125005' },
      { key: 'nearby', label: 'Nearby line', type: 'text', default: 'Nearby: Dabra Chowk, Shanti Devi Hospital' },
      { key: 'checkIn', label: 'Check-in', type: 'text', default: '2:00 PM' },
      { key: 'checkOut', label: 'Check-out', type: 'text', default: '11:00 AM' },
      { key: 'directionsUrl', label: 'Get Directions URL', type: 'url', default: 'https://www.google.com/maps/dir/?api=1&destination=Hotel+The+Royal+Jewel,+Sector+13,+Hisar,+Haryana+125005' },
      { key: 'mapEmbed', label: 'Map embed URL', type: 'url', default: 'https://maps.google.com/maps?q=Hotel+The+Royal+Jewel,+Sector+13,+Hisar,+Haryana&t=&z=15&ie=UTF8&iwloc=&output=embed' },
    ],
  },
  {
    key: 'galleryPage',
    title: 'Gallery page',
    fields: [
      { key: 'heroImage', label: 'Hero image', type: 'image', default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'Photo Gallery' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Explore the elegance and grandeur of Hotel The Royal Jewel through our curated collection of images.' },
      {
        key: 'images', label: 'Gallery images', type: 'list', itemLabel: 'image',
        itemFields: [{ key: 'url', label: 'Image', type: 'image' }],
        default: [
          { url: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782799643/room_xenwzf.png' },
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop' },
          { url: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop' },
          { url: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png' },
          { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop' },
        ],
      },
    ],
  },
  {
    key: 'roomsPage',
    title: 'Rooms page',
    fields: [
      { key: 'heroImage', label: 'Hero image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782799643/room_xenwzf.png' },
      { key: 'heading', label: 'Heading', type: 'text', default: 'Our Accommodations' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Experience unparalleled comfort and luxury in every stay. Discover the perfect space for your visit.' },
    ],
  },
  {
    key: 'about',
    title: 'About page',
    fields: [
      { key: 'heroImage', label: 'Hero image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png' },
      { key: 'heroHeading', label: 'Hero heading', type: 'text', default: 'Our Heritage of Hospitality' },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: "Discover the legacy behind Hisar's most prestigious luxury destination." },
      { key: 'storyEyebrow', label: 'Story eyebrow', type: 'text', default: 'The Royal Jewel Story' },
      { key: 'storyHeading', label: 'Story heading', type: 'text', default: 'A Vision of Modern Elegance' },
      { key: 'paragraph1', label: 'Story paragraph 1', type: 'textarea', default: 'Founded with a passion for redefining luxury hospitality in Hisar, Hotel The Royal Jewel stands as a testament to impeccable service and architectural grandeur. From our inception, we have been dedicated to providing an oasis of comfort for discerning travelers and locals alike.' },
      { key: 'paragraph2', label: 'Story paragraph 2', type: 'textarea', default: 'Our unique position as a premier rooftop destination allows us to offer unparalleled views of the city, combined with world-class amenities and a commitment to personalized experiences. Every corner of our property is designed to inspire and rejuvenate.' },
      { key: 'highlight1Title', label: 'Highlight 1 title', type: 'text', default: 'Established' },
      { key: 'highlight1Text', label: 'Highlight 1 text', type: 'text', default: 'Rooted in tradition' },
      { key: 'highlight2Title', label: 'Highlight 2 title', type: 'text', default: 'Expert Staff' },
      { key: 'highlight2Text', label: 'Highlight 2 text', type: 'text', default: 'Dedicated service' },
      { key: 'sideImage', label: 'Side image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782890838/ChatGPT_Image_Jul_1_2026_12_41_22_PM_usz3j2.png' },
      { key: 'badgeNumber', label: 'Badge number', type: 'text', default: '10+' },
      { key: 'badgeLabel', label: 'Badge label', type: 'text', default: 'Years of Excellence' },
      { key: 'valuesEyebrow', label: 'Values eyebrow', type: 'text', default: 'Our Philosophy' },
      { key: 'valuesHeading', label: 'Values heading', type: 'text', default: 'Values That Define Us' },
      {
        key: 'values', label: 'Values', type: 'list', itemLabel: 'value',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
        default: [
          { title: 'Uncompromising Quality', desc: 'From the thread count of our linens to the ingredients in our kitchen, we accept nothing but the best.' },
          { title: 'Personalized Service', desc: 'Anticipating needs before they arise, our staff is trained to provide intuitive and discreet hospitality.' },
          { title: 'Sustainable Luxury', desc: 'Committed to environmentally responsible practices without sacrificing the luxury experience.' },
        ],
      },
      { key: 'awardsImage', label: 'Awards background image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png' },
      { key: 'awardsHeading', label: 'Awards heading', type: 'text', default: 'Award-Winning Hospitality' },
      {
        key: 'stats', label: 'Award stats', type: 'list', itemLabel: 'stat',
        itemFields: [
          { key: 'number', label: 'Number', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
        default: [
          { number: '50+', label: 'Luxury Rooms' },
          { number: '5k+', label: 'Happy Guests' },
          { number: '4.9', label: 'Average Rating' },
          { number: '24/7', label: 'Room Service' },
        ],
      },
    ],
  },
  {
    key: 'contactPage',
    title: 'Contact page',
    fields: [
      { key: 'heroImage', label: 'Hero image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782799643/room_xenwzf.png' },
      { key: 'heroHeading', label: 'Hero heading', type: 'text', default: 'Contact Us' },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: 'We are here to assist you. Reach out to us for reservations, event inquiries, or any other questions.' },
      { key: 'introHeading', label: 'Intro heading', type: 'text', default: 'Get in Touch' },
      { key: 'introText', label: 'Intro text', type: 'textarea', default: "Whether you're planning a stay, organizing an event, or simply have a question, our dedicated team is at your service 24/7." },
      { key: 'address', label: 'Address (one per line)', type: 'textarea', default: 'Sector 13, Near Shanti Devi Hospital\nHisar, Haryana 125005\nIndia' },
      { key: 'reservationsPhoneDisplay', label: 'Reservations phone (display)', type: 'text', default: '+91 99308 71000' },
      { key: 'reservationsPhoneTel', label: 'Reservations phone (tel:)', type: 'text', default: '+919930871000' },
      { key: 'frontDeskPhoneDisplay', label: 'Front desk phone (display)', type: 'text', default: '+91 99308 72000' },
      { key: 'frontDeskPhoneTel', label: 'Front desk phone (tel:)', type: 'text', default: '+919930872000' },
      { key: 'emailPrimary', label: 'Primary email', type: 'text', default: 'info@hoteltheroyaljewel.com' },
      { key: 'emailEvents', label: 'Events email', type: 'text', default: 'events@hoteltheroyaljewel.com' },
      { key: 'checkIn', label: 'Check-in', type: 'text', default: '2:00 PM' },
      { key: 'checkOut', label: 'Check-out', type: 'text', default: '12:00 PM (Noon)' },
      { key: 'mapEmbed', label: 'Map embed URL', type: 'url', default: 'https://maps.google.com/maps?q=Hotel%20The%20Royal%20Jewel,%20Sector%2013,%20Hisar&t=&z=15&ie=UTF8&iwloc=&output=embed' },
    ],
  },
  {
    key: 'rooftopPage',
    title: 'Rooftop page',
    fields: [
      { key: 'heroImage', label: 'Hero image', type: 'image', default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' },
      { key: 'heroEyebrow', label: 'Hero eyebrow', type: 'text', default: 'The Crown Jewel' },
      { key: 'heroHeading', label: 'Hero heading', type: 'text', default: 'Elevated Experiences' },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', default: "Discover Hisar's premier rooftop destination. Where panoramic city views meet exceptional culinary artistry." },
      { key: 'block1Heading', label: 'Block 1 heading', type: 'text', default: 'Fine Dining Above the City' },
      { key: 'block1Text', label: 'Block 1 text', type: 'textarea', default: "Indulge in a curated menu of local delicacies and international cuisines, expertly crafted by our master chefs. Whether it's a romantic dinner under the stars or a celebratory feast with friends, our rooftop restaurant provides the perfect ambiance." },
      { key: 'block1Image', label: 'Block 1 image', type: 'image', default: 'https://res.cloudinary.com/dm3scoj2q/image/upload/v1782798871/dining-rooftop_nh4bsi.png' },
      {
        key: 'block1Bullets', label: 'Block 1 bullets', type: 'list', itemLabel: 'bullet',
        itemFields: [
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'text', label: 'Text', type: 'text' },
        ],
        default: [
          { icon: 'utensils', text: 'Signature multi-cuisine menu' },
          { icon: 'glassWater', text: 'Premium spirits and crafted mocktails' },
        ],
      },
      { key: 'block2Heading', label: 'Block 2 heading', type: 'text', default: 'Unforgettable Events' },
      { key: 'block2Text', label: 'Block 2 text', type: 'textarea', default: 'Transform your special occasions into magical memories. Our expansive rooftop can be customized for private parties, corporate gatherings, and intimate wedding receptions with the city skyline as your backdrop.' },
      { key: 'block2Image', label: 'Block 2 image', type: 'image', default: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop' },
      {
        key: 'block2Bullets', label: 'Block 2 bullets', type: 'list', itemLabel: 'bullet',
        itemFields: [
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'text', label: 'Text', type: 'text' },
        ],
        default: [
          { icon: 'music', text: 'Live music and entertainment options' },
          { icon: 'sparkles', text: 'Customizable event layouts & decor' },
        ],
      },
      { key: 'ambianceHeading', label: 'Ambiance heading', type: 'text', default: 'Experience the Magic' },
      {
        key: 'ambiance', label: 'Ambiance cards', type: 'list', itemLabel: 'card',
        itemFields: [
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
        default: [
          { icon: 'sparkles', title: 'Sunset Views', description: 'Watch the city transform as the sun dips below the horizon, painting the sky in vibrant hues.' },
          { icon: 'music', title: 'Weekend Vibes', description: 'Enjoy curated playlists and occasional live acoustic performances that set the perfect mood.' },
          { icon: 'utensils', title: 'Culinary Excellence', description: 'A menu designed to tantalize your taste buds, featuring seasonal specials and timeless classics.' },
        ],
      },
    ],
  },
];

// --- Defaults + typing ---------------------------------------------------
export type SectionData = Record<string, unknown>;

function sectionDefault(spec: SectionSpec): SectionData {
  const out: SectionData = {};
  for (const f of spec.fields) out[f.key] = f.default;
  return out;
}

export const DEFAULTS: Record<string, SectionData> = Object.fromEntries(
  SECTIONS.map((s) => [s.key, sectionDefault(s)]),
);

export const SECTION_BY_KEY: Record<string, SectionSpec> = Object.fromEntries(
  SECTIONS.map((s) => [s.key, s]),
);

// --- Provider + hook -----------------------------------------------------
type ContentMap = Record<string, SectionData>;
const ContentContext = createContext<ContentMap>({});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<ContentMap>({});

  useEffect(() => {
    getContent()
      .then((data) => setStored(data || {}))
      .catch(() => setStored({})); // fall back to defaults on any error
  }, []);

  return <ContentContext.Provider value={stored}>{children}</ContentContext.Provider>;
}

/**
 * Returns a section's data, stored values merged over defaults. Missing keys
 * fall back to defaults so the site never renders blank.
 */
export function useSection<T = SectionData>(key: string): T {
  const stored = useContext(ContentContext);
  const merged = { ...(DEFAULTS[key] || {}), ...(stored[key] || {}) };
  return merged as T;
}
