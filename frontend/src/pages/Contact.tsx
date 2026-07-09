import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { createLead } from '../lib/api';

const subjects = ['Room Reservation', 'Dining & Rooftop', 'Events & Weddings', 'General Inquiry'];

export default function ContactPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    subject: subjects[0], message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const s = params.get('subject');
    if (s && subjects.includes(s)) setForm((f) => ({ ...f, subject: s }));
  }, [params]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const name = `${form.firstName} ${form.lastName}`.trim();
    if (!name) return setError('Please enter your name.');
    if (!form.email.trim() && !form.phone.trim()) return setError('Please provide an email or phone number.');
    if (!form.message.trim()) return setError('Please enter a message.');

    setLoading(true);
    try {
      await createLead({
        name,
        email: form.email,
        phone: form.phone,
        type: 'contact',
        subject: form.subject,
        message: form.message,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all';

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Contact Us | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content="Get in touch with Hotel The Royal Jewel in Hisar. Reach out for reservations, event inquiries, or any other questions." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://res.cloudinary.com/dm3scoj2q/image/upload/v1782799643/room_xenwzf.png"
            alt="Hotel"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            We are here to assist you. Reach out to us for reservations, event inquiries, or any other questions.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-gray-900">Get in Touch</h2>
              <p className="text-gray-600 font-light text-lg mb-12">
                Whether you're planning a stay, organizing an event, or simply have a question, our dedicated team is at your service 24/7.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gold-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-gold-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2">Location</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Sector 13, Near Shanti Devi Hospital<br />
                      Hisar, Haryana 125005<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gold-50 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-gold-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2">Phone</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Reservations: <a href="tel:+919930871000" className="hover:text-gold-500 transition-colors">+91 99308 71000</a><br />
                      Front Desk: <a href="tel:+919930872000" className="hover:text-gold-500 transition-colors">+91 99308 72000</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gold-50 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="text-gold-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2">Email</h3>
                    <p className="text-gray-600 font-light leading-relaxed break-all">
                      <a href="mailto:info@hoteltheroyaljewel.com" className="hover:text-gold-500 transition-colors">info@hoteltheroyaljewel.com</a><br />
                      <a href="mailto:events@hoteltheroyaljewel.com" className="hover:text-gold-500 transition-colors">events@hoteltheroyaljewel.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gold-50 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="text-gold-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2">Check-in / Check-out</h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Check-in: 2:00 PM<br />
                      Check-out: 12:00 PM (Noon)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
              {done ? (
                <div className="text-center py-10">
                  <CheckCircle2 size={56} className="text-gold-500 mx-auto mb-6" />
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-3">Message sent!</h2>
                  <p className="text-gray-600 font-light">
                    Thank you, {form.firstName || 'there'}. We've received your message and will get back to you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold mb-8 text-gray-900">Send us a Message</h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input type="text" id="firstName" className={inputCls} placeholder="John" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" id="lastName" className={inputCls} placeholder="Doe" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="email" className={inputCls} placeholder="john@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" id="phone" className={inputCls} placeholder="+91 99308 71000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select id="subject" className={inputCls} value={form.subject} onChange={(e) => set('subject', e.target.value)}>
                        {subjects.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea id="message" rows={5} className={`${inputCls} resize-none`} placeholder="How can we help you?" value={form.message} onChange={(e) => set('message', e.target.value)}></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold tracking-wide flex items-center justify-center gap-2 disabled:opacity-60">
                      <Send size={18} />
                      {loading ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 w-full relative">
        <iframe
          src="https://maps.google.com/maps?q=Hotel%20The%20Royal%20Jewel,%20Sector%2013,%20Hisar&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Location"
        ></iframe>
      </section>
    </div>
  );
}
