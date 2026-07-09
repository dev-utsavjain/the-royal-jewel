// Tiny API client. Same-origin `/api` in prod (backend serves the built SPA);
// Vite dev proxy forwards `/api` to the Go server on :8080.
const BASE = '/api';
const TOKEN_KEY = 'trj_admin_token';

export interface Amenity { name: string; icon: string; }
export interface Room {
  ID?: number;
  slug: string;
  name: string;
  price: string;
  mainImage: string;
  gallery: string[];
  description: string;
  details: string;
  size: string;
  bedType: string;
  occupancy: string;
  amenities: Amenity[];
  features: string[];
  sortOrder: number;
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  // 204 No Content
  return res.status === 204 ? (undefined as T) : res.json();
}

export const login = (email: string, password: string) =>
  req<{ token: string; email: string }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const listRooms = () => req<Room[]>('/rooms');
export const createRoom = (room: Room) =>
  req<Room>('/admin/rooms', { method: 'POST', body: JSON.stringify(room) });
export const updateRoom = (id: number, room: Room) =>
  req<Room>(`/admin/rooms/${id}`, { method: 'PUT', body: JSON.stringify(room) });
export const deleteRoom = (id: number) =>
  req<void>(`/admin/rooms/${id}`, { method: 'DELETE' });

// --- Leads (contact + booking enquiries) ---
export interface Lead {
  ID?: number;
  name: string;
  email: string;
  phone: string;
  type: string;    // "contact" | "booking" | "event"
  subject: string;
  message: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  status?: string; // "new" | "contacted" | "closed"
  CreatedAt?: string;
}

export const createLead = (lead: Partial<Lead>) =>
  req<{ message: string; id: number }>('/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  });
export const listLeads = () => req<Lead[]>('/admin/leads');
export const updateLeadStatus = (id: number, status: string) =>
  req<Lead>(`/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteLead = (id: number) =>
  req<void>(`/admin/leads/${id}`, { method: 'DELETE' });

// --- Image upload (multipart — bypasses the JSON req() helper) ---
export async function uploadImage(file: File): Promise<{ id: number; url: string }> {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(BASE + '/admin/images', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Upload failed (${res.status})`);
  }
  return res.json();
}
