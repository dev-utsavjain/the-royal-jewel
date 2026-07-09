import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import InnerHero from '../components/InnerHero';

const faqs = [
  {
    q: 'What are your check-in and check-out times?',
    a: 'Check-in is from 2:00 PM and check-out is by 12:00 PM (noon). Early check-in and late check-out can be arranged subject to availability.',
  },
  {
    q: 'How do I make a reservation?',
    a: 'You can book directly through the "Book Now" button anywhere on this site, call us at +91 99308 71000, or send an enquiry through our Contact page.',
  },
  {
    q: 'Is breakfast included?',
    a: 'Complimentary breakfast is included with Premium Rooms and the Royal Suite. It can be added to a Deluxe Room booking on request.',
  },
  {
    q: 'Do you offer airport or railway station transfers?',
    a: 'Yes. Complimentary transfers are included with the Royal Suite, and can be arranged for other room types at an additional charge. Please request at the time of booking.',
  },
  {
    q: 'Is parking available?',
    a: 'Yes, we offer complimentary on-site parking for all in-house guests.',
  },
  {
    q: 'Do you host weddings and events?',
    a: 'Absolutely. Our rooftop venue and banquet spaces are ideal for weddings, corporate events, and celebrations. Reach out via our Contact page for a custom proposal.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Cancellations made at least 48 hours before check-in receive a full refund. See our Cancellation Policy page for full details.',
  },
  {
    q: 'Are pets allowed?',
    a: 'We currently welcome service animals. For other pets, please contact the front desk before booking so we can advise on availability.',
  },
];

export default function FAQ() {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <Helmet>
        <title>FAQs | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content="Frequently asked questions about staying at Hotel The Royal Jewel, Hisar — check-in times, bookings, breakfast, transfers, events and more." />
      </Helmet>
      <InnerHero title="Frequently Asked Questions" subtitle="Everything you need to know before your stay." />

      <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="group bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-serif text-lg font-semibold text-gray-900">
                {f.q}
                <ChevronDown size={20} className="text-gold-500 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 text-gray-600 font-light leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center bg-gold-50 rounded-2xl p-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Still have questions?</h2>
          <p className="text-gray-600 font-light mb-6">Our team is available 24/7 to help you plan the perfect stay.</p>
          <Link to="/contact" className="inline-block px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold tracking-wide">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
