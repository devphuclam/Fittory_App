// api.js
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.68.22:9000';

async function getToken() {
  return await SecureStore.getItemAsync('token');
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/user/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (res.ok && data.token) {
    await SecureStore.setItemAsync('token', data.token);
  }

  return data;
}

export async function register(email, password) {
  const res = await fetch(`${BASE_URL}/auth/user/emailpass/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getUser() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/auth/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function logout() {
  await SecureStore.deleteItemAsync('token');
}
