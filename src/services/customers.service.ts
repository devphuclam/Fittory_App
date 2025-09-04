// src/api/services/customers.service.ts
import api from '../api/api';

export async function getProfile() {
  const r = await api.get('/store/customers/me');
  return r.data?.customer ?? r.data;
}

export async function updateProfile(payload: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: any;
}) {
  // try PATCH /store/customers/me — backend must support it (or use custom route)
  const r = await api.post('/store/customers/me', payload);
  return r.data?.customer ?? r.data;
}

export async function createStoreCustomer(payload: any) {
  const r = await api.post('/store/customers', payload);
  return r.data;
}
