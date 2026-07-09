import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CalendarCheck, CheckCircle2, Phone } from 'lucide-react';
import InnerHero from '../components/InnerHero';
import { Room, listRooms, createLead } from '../lib/api';

export default function Booking() {
  const [params] = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', roomSlug: '',
    checkIn: '', checkOut: '', guests: '2', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    listRooms()
      .then((r) => {
        setRooms(r);
        const pre = params.get('room');
        if (pre && r.some((x) => x.slug === pre)) {
          setForm((f) => ({ ...f, roomSlug: pre }));
        }
      })
      .catch(() => {});
  }, [params]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.email.trim() && !form.phone.trim()) return setError('Please provide an email or phone number.');

    setLoading(true);
    const roomName = rooms.find((r) => r.slug === form.roomSlug)?.name || form.roomSlug;
    try {
      await createLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        type: 'booking',
        subject: roomName ? `Booking: ${roomName}` : 'Room Booking',
        message: form.message,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
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
        <title>Book Your Stay | Hotel The Royal Jewel Hisar</title>
        <meta name="description" content="Request a booking at Hotel The Royal Jewel, Hisar. Choose your room, dates and guests — our team will confirm your reservation." />
      </Helmet>
      <InnerHero title="Book Your Stay" subtitle="Tell us your dates and preferences — we'll confirm your reservation shortly." />

      <section className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          {done ? (
            <div className="text-center py-10">
              <CheckCircle2 size={56} className="text-gold-500 mx-auto mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-3">Booking request received!</h2>
              <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
                Thank you, {form.name.split(' ')[0]}. Our reservations team will contact you shortly to confirm your stay.
              </p>
              <Link to="/" className="inline-block px-8 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold tracking-wide">
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-3 text-gray-900 mb-2">
                <CalendarCheck className="text-gold-500" size={24} />
                <h2 className="font-serif text-2xl font-bold">Reservation Details</h2>
              </div>

              {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input id="name" className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input id="phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 99308 71000" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input id="email" type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="john@example.com" />
              </div>

              <div>
                <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select id="room" className={inputCls} value={form.roomSlug} onChange={(e) => set('roomSlug', e.target.value)}>
                  <option value="">No preference</option>
                  {rooms.map((r) => (
                    <option key={r.slug} value={r.slug}>{r.name} — {r.price}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input id="checkIn" type="date" className={inputCls} value={form.checkIn} onChange={(e) => set('checkIn', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input id="checkOut" type="date" className={inputCls} value={form.checkOut} onChange={(e) => set('checkOut', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <input id="guests" type="number" min="1" className={inputCls} value={form.guests} onChange={(e) => set('guests', e.target.value)} />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea id="message" rows={4} className={`${inputCls} resize-none`} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Any preferences or requests?"></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold tracking-wide disabled:opacity-60">
                {loading ? 'Submitting…' : 'Request Booking'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Prefer to talk? Call{' '}
                <a href="tel:+919930871000" className="text-gold-500 hover:text-gold-600 font-medium inline-flex items-center gap-1">
                  <Phone size={14} /> +91 99308 71000
                </a>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
