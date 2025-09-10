// src/api/services/customers.service.ts
import api from '../api/api';
import { Alert } from 'react-native';
import { MEDUSA_BASE_URL, MEDUSA_PUBLISHABLE_KEY } from '../config';
import axios from 'axios';

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

export async function generateResetPasswordToken(identifier: string) {
  const r = await api.post('/auth/customer/emailpass/reset-password', {
    identifier,
  });
  return r.status;
}

export async function resetPassword(params: {
  email: string;
  password: string;
  token: string;
}) {
  const { email, password, token } = params;
  try {
    const r = await axios.post(
      `${MEDUSA_BASE_URL}/auth/customer/emailpass/update`,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY, // luôn gửi publishable key cho store routes
        },
      }
    );
    return r.status;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Reset password error';
    throw new Error(
      typeof message === 'string' ? message : JSON.stringify(message)
    );
  }
}
