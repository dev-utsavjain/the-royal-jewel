import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Lead, listLeads, updateLeadStatus, deleteLead, clearToken } from '../lib/api';

const statusStyles: Record<string, string> = {
  new: 'bg-gold-50 text-gold-600 border-gold-200',
  contacted: 'bg-blue-50 text-blue-600 border-blue-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const onAuthError = (e: Error) => {
    if (e.message.includes('token') || e.message.includes('401')) {
      clearToken();
      navigate('/admin/login');
      return true;
    }
    return false;
  };

  const load = () => {
    setLoading(true);
    listLeads()
      .then(setLeads)
      .catch((e) => { if (!onAuthError(e)) setError(e.message); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (lead: Lead, status: string) => {
    if (!lead.ID) return;
    try {
      const updated = await updateLeadStatus(lead.ID, status);
      setLeads((ls) => ls.map((l) => (l.ID === lead.ID ? updated : l)));
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    }
  };

  const remove = async (lead: Lead) => {
    if (!lead.ID || !confirm(`Delete enquiry from "${lead.name}"?`)) return;
    try {
      await deleteLead(lead.ID);
      setLeads((ls) => ls.filter((l) => l.ID !== lead.ID));
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    }
  };

  const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-white px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="font-serif text-xl font-bold tracking-wider text-gold-500">
          The Royal Jewel <span className="text-gray-400 font-sans text-sm font-light">Leads</span>
        </div>
        <Link to="/admin" className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold-500 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Enquiries &amp; Bookings</h1>
          <span className="text-gray-500 text-sm">{leads.length} total</span>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100 mb-6">{error}</div>}
        {loading && <p className="text-gray-500">Loading…</p>}
        {!loading && leads.length === 0 && <p className="text-gray-500">No enquiries yet.</p>}

        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.ID} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-serif text-lg font-bold text-gray-900">{lead.name}</span>
                    <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{lead.type}</span>
                    <span className="text-xs text-gray-400">{fmtDate(lead.CreatedAt)}</span>
                  </div>
                  {lead.subject && <div className="text-gold-600 text-sm font-medium mt-1">{lead.subject}</div>}
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-600">
                    {lead.email && <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 hover:text-gold-500 break-all min-w-0"><Mail size={14} className="shrink-0" /> {lead.email}</a>}
                    {lead.phone && <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold-500 break-all min-w-0"><Phone size={14} className="shrink-0" /> {lead.phone}</a>}
                    {(lead.checkIn || lead.checkOut) && (
                      <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> {lead.checkIn || '?'} → {lead.checkOut || '?'}{lead.guests ? ` · ${lead.guests} guest(s)` : ''}</span>
                    )}
                  </div>
                  {lead.message && <p className="text-gray-600 font-light text-sm mt-3 whitespace-pre-wrap">{lead.message}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={lead.status || 'new'}
                    onChange={(e) => changeStatus(lead, e.target.value)}
                    className={`text-xs font-medium uppercase tracking-wider px-3 py-2.5 min-h-[44px] rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500 ${statusStyles[lead.status || 'new']}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button onClick={() => remove(lead)} className="p-3 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete enquiry">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
