import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Upload, ImageOff } from 'lucide-react';
import {
  Room, Amenity, listRooms, createRoom, updateRoom, deleteRoom, clearToken, uploadImage,
} from '../lib/api';

const blankRoom: Room = {
  slug: '', name: '', price: '', mainImage: '', gallery: [], description: '',
  details: '', size: '', bedType: '', occupancy: '', amenities: [], features: [], sortOrder: 0,
};

// Amenities edit as "Name | icon" lines; icon is a key: wind, wifi, tv, coffee.
const amenitiesToText = (a: Amenity[]) => a.map((x) => `${x.name} | ${x.icon}`).join('\n');
const textToAmenities = (t: string): Amenity[] =>
  t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [name, icon] = l.split('|').map((s) => s.trim());
    return { name: name || '', icon: icon || 'wifi' };
  });
const linesToArr = (t: string) => t.split('\n').map((s) => s.trim()).filter(Boolean);

export default function AdminCMS() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editing, setEditing] = useState<Room | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Text mirrors for the array/struct fields being edited.
  const [galleryText, setGalleryText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [amenitiesText, setAmenitiesText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const load = () => {
    setLoading(true);
    listRooms().then(setRooms).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onAuthError = (e: Error) => {
    if (e.message.includes('token') || e.message.includes('401')) {
      clearToken();
      navigate('/admin/login');
      return true;
    }
    return false;
  };

  const startEdit = (room: Room) => {
    setError('');
    setEditing({ ...room });
    setGalleryText(room.gallery.join('\n'));
    setFeaturesText(room.features.join('\n'));
    setAmenitiesText(amenitiesToText(room.amenities));
  };

  const startNew = () => {
    setError('');
    setEditing({ ...blankRoom, sortOrder: rooms.length });
    setGalleryText('');
    setFeaturesText('');
    setAmenitiesText('');
  };

  const save = async () => {
    if (!editing) return;
    const payload: Room = {
      ...editing,
      gallery: linesToArr(galleryText),
      features: linesToArr(featuresText),
      amenities: textToAmenities(amenitiesText),
      // Keep main image consistent with the edited gallery (first entry).
      mainImage: linesToArr(galleryText)[0] || editing.mainImage || '',
    };
    try {
      if (editing.ID) await updateRoom(editing.ID, payload);
      else await createRoom(payload);
      setEditing(null);
      load();
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    }
  };

  // Upload device images → append the returned /api/images/:id URLs to the gallery.
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadImage(file);
        urls.push(url);
      }
      setGalleryText((prev) => [prev.trim(), ...urls].filter(Boolean).join('\n'));
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const galleryUrls = galleryText.split('\n').map((s) => s.trim()).filter(Boolean);

  const remove = async (room: Room) => {
    if (!room.ID || !confirm(`Delete "${room.name}"?`)) return;
    try {
      await deleteRoom(room.ID);
      load();
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    }
  };

  const field = (label: string, value: string, onChange: (v: string) => void, placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
      />
    </div>
  );

  const area = (label: string, value: string, onChange: (v: string) => void, hint: string, rows = 3) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-gray-400 font-normal">({hint})</span></label>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none font-mono text-sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-white px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="font-serif text-xl font-bold tracking-wider text-gold-500">
          The Royal Jewel <span className="text-gray-400 font-sans text-sm font-light">CMS</span>
        </div>
        <Link to="/admin" className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold-500 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Rooms</h1>
          <button onClick={startNew} className="flex items-center gap-2 px-5 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold text-sm">
            <Plus size={18} /> Add Room
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100 mb-6">{error}</div>}
        {loading && <p className="text-gray-500">Loading…</p>}

        <div className="space-y-3">
          {rooms.map((room) => (
            <div key={room.ID} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <div className="font-serif text-lg font-bold text-gray-900">{room.name}</div>
                <div className="text-gray-500 text-sm">{room.slug} · {room.price}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(room)} className="p-3 text-gray-500 hover:text-gold-500 transition-colors" aria-label="Edit"><Pencil size={18} /></button>
                <button onClick={() => remove(room)} className="p-3 text-gray-500 hover:text-red-500 transition-colors" aria-label="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {!loading && rooms.length === 0 && <p className="text-gray-500">No rooms yet. Add one to get started.</p>}
        </div>
      </main>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8 my-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-gray-900">{editing.ID ? 'Edit Room' : 'New Room'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-700" aria-label="Close"><X size={22} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('Slug', editing.slug, (v) => setEditing({ ...editing, slug: v }), 'deluxe')}
                {field('Name', editing.name, (v) => setEditing({ ...editing, name: v }), 'Deluxe Room')}
                {field('Price', editing.price, (v) => setEditing({ ...editing, price: v }), 'From Rs. 2,328 / night')}
                {field('Sort Order', String(editing.sortOrder), (v) => setEditing({ ...editing, sortOrder: parseInt(v) || 0 }))}
                {field('Size', editing.size, (v) => setEditing({ ...editing, size: v }), '320 sq. ft.')}
                {field('Bed Type', editing.bedType, (v) => setEditing({ ...editing, bedType: v }), 'Queen-size bed')}
                {field('Occupancy', editing.occupancy, (v) => setEditing({ ...editing, occupancy: v }), '2 Adults, 1 Child')}
              </div>
              {area('Description', editing.description, (v) => setEditing({ ...editing, description: v }), 'short summary', 2)}
              {area('Details', editing.details, (v) => setEditing({ ...editing, details: v }), 'long description', 3)}
              {area('Gallery', galleryText, setGalleryText, 'one image URL per line; first is the main image', 3)}

              {/* Upload from device */}
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer text-sm font-medium transition-colors w-fit">
                  <Upload size={16} />
                  {uploading ? 'Uploading…' : 'Upload from device'}
                  <input
                    type="file" accept="image/*" multiple className="hidden" disabled={uploading}
                    onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }}
                  />
                </label>
                {galleryUrls.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                    {galleryUrls.map((url, i) => (
                      <div key={url} className="relative aspect-video rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                        {failedImages.has(url) ? (
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageOff size={20} /></div>
                        ) : (
                          <img
                            src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover"
                            onError={() => setFailedImages((s) => new Set(s).add(url))}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setGalleryText(galleryUrls.filter((_, j) => j !== i).join('\n'))}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500"
                          aria-label="Remove image"
                        >
                          <X size={16} />
                        </button>
                        {i === 0 && <span className="absolute bottom-1 left-1 bg-gold-500 text-white text-[10px] px-1.5 py-0.5 rounded">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
                {galleryUrls.length === 0 && (
                  <p className="flex items-center gap-2 text-gray-400 text-xs mt-3"><ImageOff size={14} /> No images yet — paste URLs above or upload from your device.</p>
                )}
              </div>

              {area('Amenities', amenitiesText, setAmenitiesText, 'one per line: Name | icon  (icons: wind, wifi, tv, coffee)', 4)}
              {area('Features', featuresText, setFeaturesText, 'one per line', 4)}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={save} className="flex-1 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold flex items-center justify-center gap-2">
                <Save size={18} /> Save
              </button>
              <button onClick={() => setEditing(null)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
