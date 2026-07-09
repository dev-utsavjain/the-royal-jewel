import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BedDouble, Settings, ExternalLink, LogOut, Inbox, MailOpen } from 'lucide-react';
import { listRooms, listLeads, clearToken } from '../lib/api';

export default function AdminConsole() {
  const navigate = useNavigate();
  const [roomCount, setRoomCount] = useState<number | null>(null);
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [newLeads, setNewLeads] = useState<number>(0);

  useEffect(() => {
    listRooms().then((r) => setRoomCount(r.length)).catch(() => setRoomCount(0));
    listLeads()
      .then((l) => {
        setLeadCount(l.length);
        setNewLeads(l.filter((x) => (x.status || 'new') === 'new').length);
      })
      .catch((e: Error) => {
        if (e.message.includes('token') || e.message.includes('401')) {
          clearToken();
          navigate('/admin/login');
          return;
        }
        setLeadCount(0);
        setNewLeads(0);
      });
  }, [navigate]);

  const logout = () => {
    clearToken();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-white px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="font-serif text-xl font-bold tracking-wider text-gold-500">
          The Royal Jewel <span className="text-gray-400 font-sans text-sm font-light">Admin</span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold-500 transition-colors">
          <LogOut size={16} /> Log out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-10">Manage your hotel website content.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <BedDouble className="text-gold-500 mb-4" size={28} />
            <div className="font-serif text-4xl font-bold text-gray-900">{roomCount ?? '—'}</div>
            <div className="text-gray-500 text-sm uppercase tracking-wider mt-1">Rooms Published</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <Inbox className="text-gold-500 mb-4" size={28} />
            <div className="font-serif text-4xl font-bold text-gray-900">{leadCount ?? '—'}</div>
            <div className="text-gray-500 text-sm uppercase tracking-wider mt-1">
              Total Enquiries {newLeads > 0 && <span className="text-gold-600 normal-case">· {newLeads} new</span>}
            </div>
          </div>

          <Link to="/admin/cms" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-500 transition-all group">
            <Settings className="text-gold-500 mb-4" size={28} />
            <div className="font-serif text-xl font-bold text-gray-900 group-hover:text-gold-600">Manage Rooms</div>
            <div className="text-gray-500 text-sm mt-1">Add, edit or remove room types</div>
          </Link>

          <Link to="/admin/leads" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-500 transition-all group">
            <MailOpen className="text-gold-500 mb-4" size={28} />
            <div className="font-serif text-xl font-bold text-gray-900 group-hover:text-gold-600">View Enquiries</div>
            <div className="text-gray-500 text-sm mt-1">Contact messages &amp; booking requests</div>
          </Link>

          <a href="/" target="_blank" rel="noreferrer" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-500 transition-all group">
            <ExternalLink className="text-gold-500 mb-4" size={28} />
            <div className="font-serif text-xl font-bold text-gray-900 group-hover:text-gold-600">View Site</div>
            <div className="text-gray-500 text-sm mt-1">Open the public website</div>
          </a>
        </div>
      </main>
    </div>
  );
}
