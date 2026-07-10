import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, ImageOff, Plus, Trash2, ArrowUp, ArrowDown, Check, Images } from 'lucide-react';
import { getContent, updateContentSection, uploadImage, clearToken } from '../lib/api';
import { SECTIONS, SECTION_BY_KEY, DEFAULTS, ICON_KEYS, type FieldSpec } from '../lib/content';

type AnyObj = Record<string, any>;

const IMAGES_VIEW = '__images__';

// One editable image somewhere in the content tree, flattened for the overview.
interface ImageEntry {
  id: string;
  sectionKey: string;
  sectionTitle: string;
  label: string;
  value: string;
  set: (v: string) => void;
}

export default function AdminContent() {
  const navigate = useNavigate();
  const [data, setData] = useState<Record<string, AnyObj> | null>(null);
  const [activeKey, setActiveKey] = useState<string>(IMAGES_VIEW);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState('');
  const [justSaved, setJustSaved] = useState('');

  useEffect(() => {
    getContent()
      .then((stored) => {
        const merged: Record<string, AnyObj> = {};
        for (const s of SECTIONS) merged[s.key] = { ...DEFAULTS[s.key], ...(stored?.[s.key] || {}) };
        setData(merged);
      })
      .catch((e: Error) => {
        if (e.message.includes('token') || e.message.includes('401')) {
          clearToken();
          navigate('/admin/login');
          return;
        }
        const merged: Record<string, AnyObj> = {};
        for (const s of SECTIONS) merged[s.key] = { ...DEFAULTS[s.key] };
        setData(merged);
      });
  }, [navigate]);

  const onAuthError = (e: Error) => {
    if (e.message.includes('token') || e.message.includes('401')) {
      clearToken();
      navigate('/admin/login');
      return true;
    }
    return false;
  };

  const markDirty = (key: string) => setDirty((prev) => new Set(prev).add(key));

  const patchField = (sectionKey: string, fieldKey: string, value: unknown) => {
    setData((d) => (d ? { ...d, [sectionKey]: { ...d[sectionKey], [fieldKey]: value } } : d));
    markDirty(sectionKey);
  };

  const patchListItem = (sectionKey: string, listKey: string, idx: number, itemKey: string, value: unknown) => {
    setData((d) => {
      if (!d) return d;
      const arr = [...((d[sectionKey][listKey] as AnyObj[]) || [])];
      arr[idx] = { ...arr[idx], [itemKey]: value };
      return { ...d, [sectionKey]: { ...d[sectionKey], [listKey]: arr } };
    });
    markDirty(sectionKey);
  };

  const saveSection = async (key: string) => {
    if (!data) return;
    setError('');
    setSavingKey(key);
    try {
      await updateContentSection(key, data[key]);
      setDirty((prev) => { const n = new Set(prev); n.delete(key); return n; });
      setJustSaved(key);
      setTimeout(() => setJustSaved(''), 2000);
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    } finally {
      setSavingKey('');
    }
  };

  const saveAll = async () => {
    if (!data || dirty.size === 0) return;
    setError('');
    setSavingKey(IMAGES_VIEW);
    try {
      for (const key of Array.from(dirty) as string[]) await updateContentSection(key, data[key]);
      setDirty(new Set());
      setJustSaved(IMAGES_VIEW);
      setTimeout(() => setJustSaved(''), 2000);
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    } finally {
      setSavingKey('');
    }
  };

  if (!data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading…</div>;
  }

  // Flatten every image field across all sections for the overview.
  const imageEntries: ImageEntry[] = [];
  for (const spec of SECTIONS) {
    for (const f of spec.fields) {
      if (f.type === 'image') {
        imageEntries.push({
          id: `${spec.key}.${f.key}`, sectionKey: spec.key, sectionTitle: spec.title,
          label: f.label, value: (data[spec.key][f.key] as string) || '',
          set: (v) => patchField(spec.key, f.key, v),
        });
      } else if (f.type === 'list' && f.itemFields?.some((x) => x.type === 'image')) {
        const arr = (data[spec.key][f.key] as AnyObj[]) || [];
        arr.forEach((item, idx) => {
          for (const imgF of f.itemFields!.filter((x) => x.type === 'image')) {
            imageEntries.push({
              id: `${spec.key}.${f.key}.${idx}.${imgF.key}`, sectionKey: spec.key, sectionTitle: spec.title,
              label: `${f.label} #${idx + 1}`, value: (item[imgF.key] as string) || '',
              set: (v) => patchListItem(spec.key, f.key, idx, imgF.key, v),
            });
          }
        });
      }
    }
  }

  const section = activeKey === IMAGES_VIEW ? null : SECTION_BY_KEY[activeKey];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-white px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="font-serif text-xl font-bold tracking-wider text-gold-500">
          The Royal Jewel <span className="text-gray-400 font-sans text-sm font-light">Content</span>
        </div>
        <Link to="/admin" className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold-500 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Section nav */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          <button
            onClick={() => setActiveKey(IMAGES_VIEW)}
            className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeKey === IMAGES_VIEW ? 'bg-gold-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Images size={16} /> All Images
          </button>
          <div className="hidden lg:block h-px bg-gray-200 my-1" />
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveKey(s.key)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-between gap-2 ${
                s.key === activeKey ? 'bg-gold-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s.title}
              {dirty.has(s.key) && <span className="w-2 h-2 rounded-full bg-gold-500 lg:bg-current shrink-0" title="Unsaved changes" />}
            </button>
          ))}
        </nav>

        {/* Editor / overview */}
        <section>
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100 mb-6">{error}</div>}

          {activeKey === IMAGES_VIEW ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-serif text-2xl font-bold text-gray-900">All Images</h1>
                <button
                  onClick={saveAll}
                  disabled={dirty.size === 0 || savingKey === IMAGES_VIEW}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold text-sm disabled:opacity-50"
                >
                  {justSaved === IMAGES_VIEW ? <Check size={18} /> : <Save size={18} />}
                  {savingKey === IMAGES_VIEW ? 'Saving…' : justSaved === IMAGES_VIEW ? 'Saved' : dirty.size ? `Save ${dirty.size} change${dirty.size > 1 ? 's' : ''}` : 'Saved'}
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-6">Every image on the site, grouped by section. Change any one by uploading a file or pasting a URL, then Save.</p>

              <div className="space-y-8">
                {SECTIONS.map((spec) => {
                  const entries = imageEntries.filter((e) => e.sectionKey === spec.key);
                  if (!entries.length) return null;
                  return (
                    <div key={spec.key}>
                      <h2 className="font-serif text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{spec.title}</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {entries.map((e) => (
                          <div key={e.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <ImageField label={e.label} value={e.value} onChange={e.set} onAuthError={onAuthError} setError={setError} big />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : section ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-serif text-2xl font-bold text-gray-900">{section.title}</h1>
                <button
                  onClick={() => saveSection(section.key)}
                  disabled={savingKey === section.key}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold text-sm disabled:opacity-60"
                >
                  {justSaved === section.key ? <Check size={18} /> : <Save size={18} />}
                  {savingKey === section.key ? 'Saving…' : justSaved === section.key ? 'Saved' : 'Save'}
                </button>
              </div>
              {section.blurb && <p className="text-gray-500 text-sm mb-6">{section.blurb}</p>}

              <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                {section.fields.map((f) => (
                  <Fragment key={f.key}>
                    <FieldInput
                      spec={f}
                      value={data[section.key][f.key]}
                      onChange={(v) => patchField(section.key, f.key, v)}
                      onAuthError={onAuthError}
                      setError={setError}
                    />
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}

// --- Field renderers -----------------------------------------------------

interface FieldProps {
  spec: FieldSpec;
  value: any;
  onChange: (v: any) => void;
  onAuthError: (e: Error) => boolean;
  setError: (s: string) => void;
}

function FieldInput({ spec, value, onChange, onAuthError, setError }: FieldProps) {
  const label = <label className="block text-sm font-medium text-gray-700 mb-1">{spec.label}</label>;

  switch (spec.type) {
    case 'textarea':
      return (
        <div>
          {label}
          <textarea
            value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 resize-y"
          />
        </div>
      );
    case 'icon':
      return (
        <div>
          {label}
          <select
            value={value ?? ''} onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      );
    case 'image':
      return <ImageField label={spec.label} value={value ?? ''} onChange={onChange} onAuthError={onAuthError} setError={setError} />;
    case 'list':
      return <ListEditor spec={spec} value={Array.isArray(value) ? value : []} onChange={onChange} onAuthError={onAuthError} setError={setError} />;
    case 'text':
    case 'url':
    default:
      return (
        <div>
          {label}
          <input
            value={value ?? ''} onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      );
  }
}

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onAuthError: (e: Error) => boolean;
  setError: (s: string) => void;
  big?: boolean;
}

function ImageField({ label, value, onChange, onAuthError, setError, big }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setError('');
    setUploading(true);
    setFailed(false);
    try {
      const { url } = await uploadImage(files[0]);
      onChange(url);
    } catch (e) {
      const err = e as Error;
      if (!onAuthError(err)) setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const preview = (
    <div className={`${big ? 'w-full aspect-video' : 'w-28 h-20'} rounded-md overflow-hidden border border-gray-200 bg-gray-50 shrink-0 flex items-center justify-center`}>
      {value && !failed ? (
        <img src={value} alt="" className="w-full h-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <ImageOff size={20} className="text-gray-300" />
      )}
    </div>
  );

  const controls = (
    <div className="flex-1 space-y-2 min-w-0">
      <input
        value={value} onChange={(e) => { onChange(e.target.value); setFailed(false); }}
        placeholder="Image URL"
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
      />
      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg cursor-pointer text-sm font-medium transition-colors w-fit">
        <Upload size={15} />
        {uploading ? 'Uploading…' : 'Change image'}
        <input type="file" accept="image/*" className="hidden" disabled={uploading}
          onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }} />
      </label>
    </div>
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {big ? (
        <div className="space-y-3">{preview}{controls}</div>
      ) : (
        <div className="flex gap-3 items-start">{preview}{controls}</div>
      )}
    </div>
  );
}

interface ListProps {
  spec: FieldSpec;
  value: AnyObj[];
  onChange: (v: AnyObj[]) => void;
  onAuthError: (e: Error) => boolean;
  setError: (s: string) => void;
}

function ListEditor({ spec, value, onChange, onAuthError, setError }: ListProps) {
  const itemFields = spec.itemFields || [];

  const update = (i: number, key: string, v: unknown) => {
    const next = value.map((item, j) => (j === i ? { ...item, [key]: v } : item));
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => {
    const blank: AnyObj = {};
    for (const f of itemFields) blank[f.key] = f.type === 'icon' ? ICON_KEYS[0] : '';
    onChange([...value, blank]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{spec.label}</label>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50/60">
            <div className="flex justify-end gap-1 mb-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Move up"><ArrowUp size={15} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Move down"><ArrowDown size={15} /></button>
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-gray-400 hover:text-red-500" aria-label="Remove"><Trash2 size={15} /></button>
            </div>
            <div className="space-y-3">
              {itemFields.map((f) => (
                <Fragment key={f.key}>
                  <FieldInput
                    spec={f}
                    value={item[f.key]}
                    onChange={(v) => update(i, f.key, v)}
                    onAuthError={onAuthError}
                    setError={setError}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gold-400 hover:text-gold-600 transition-colors text-sm font-medium">
        <Plus size={16} /> Add {spec.itemLabel || 'item'}
      </button>
    </div>
  );
}
