import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.68.36:9000';

const api = axios.create({ baseURL: BASE_URL });

// interceptor để tự động gắn token vào headers
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(email, password) {
  const res = await api.post('/auth/user/emailpass', { email, password });
  const data = res.data;
  if (data.token) {
    await SecureStore.setItemAsync('token', data.token);
  }
  return data;
}

export async function register(email, password) {
  const res = await api.post('/auth/user/emailpass/register', {
    email,
    password,
  });
  return res.data;
}

export async function getUser() {
  const res = await api.get('/auth/user');
  return res.data;
}

export async function logout() {
  await SecureStore.deleteItemAsync('token');
}
