// src/api/api.ts
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { MEDUSA_BASE_URL, MEDUSA_PUBLISHABLE_KEY, TOKEN_KEY } from '../config';

let api: AxiosInstance;

function createApi() {
  const inst = axios.create({
    baseURL: MEDUSA_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY, // luôn gửi publishable key cho store routes
    },
    timeout: 15000,
  });

  // request interceptor: thêm Authorization nếu có token
  inst.interceptors.request.use(async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        // config.headers có thể là undefined hoặc là AxiosHeaders.
        // Chúng ta sẽ gán/ghi header bằng cách cast tạm sang Record<string,string>
        // để TypeScript không complain.
        if (!config.headers) {
          // tạo mới headers object có key-value string
          config.headers = {
            Authorization: `Bearer ${token}`,
          } as AxiosRequestHeaders;
        } else {
          // ghi thêm vào headers hiện có
          (config.headers as Record<string, string>)[
            'Authorization'
          ] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore storage errors — vẫn trả về config
      console.warn('Failed to attach token to request:', e);
    }
    return config;
  });

  // response interceptor: bạn có thể thêm global error handling ở đây
  inst.interceptors.response.use(
    (res) => res,
    (err) => {
      // Optionally unwrap server error message
      return Promise.reject(err);
    }
  );

  return inst;
}

api = createApi();

/** Helpers to manage token in secure storage */
export async function setToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/**
 * login(email, password)
 * - POST /auth/customer/emailpass
 * - Lưu token nếu server trả token
 * - Trả về token string
 */
export async function login(email: string, password: string): Promise<string> {
  const url = '/auth/customer/emailpass';
  try {
    const r = await api.post(url, { email, password });
    const data = r.data ?? {};
    const token = data.token;
    if (!token) {
      throw new Error('Server did not return token on login');
    }
    await setToken(token);
    return token;
  } catch (err: any) {
    // ném Error với message rõ ràng
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Login error';
    throw new Error(
      typeof message === 'string' ? message : JSON.stringify(message)
    );
  }
}

/**
 * getUser() -> GET /store/customers/me
 * - Yêu cầu có token (interceptor sẽ thêm) và publishable key set ở header mặc định.
 * - Trả về customer object (or throw)
 */
export async function getUser(): Promise<any> {
  try {
    const r = await api.get('/store/customers/me');
    const data = r.data;
    // normalize possible shapes
    if (data?.customer) return data.customer;
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Get user error';
    throw new Error(
      typeof message === 'string' ? message : JSON.stringify(message)
    );
  }
}

/**
 * registerAuthOnly -> gọi /auth/customer/emailpass/register
 * (nên gọi /store/customers sau nếu bạn cần customer record)
 */
export async function registerAuthOnly(email: string, password: string) {
  try {
    const r = await api.post('/auth/customer/emailpass/register', {
      email,
      password,
    });
    const data = r.data;
    // nếu server trả token, lưu
    if (data?.token) await setToken(data.token);
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Register error';
    throw new Error(
      typeof message === 'string' ? message : JSON.stringify(message)
    );
  }
}

/**
 * createStoreCustomer -> POST /store/customers
 * - Gọi được từ client nhưng cần x-publishable-api-key header (đã set).
 * - Nếu server yêu cầu Authorization, interceptor sẽ cung cấp token nếu có.
 */
export async function createStoreCustomer(body: {
  email: string;
  first_name?: string;
  last_name?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const r = await api.post('/store/customers', body);
    return r.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Create customer error';
    throw new Error(
      typeof message === 'string' ? message : JSON.stringify(message)
    );
  }
}

export async function generateResetPasswordToken(identifier: string) {
  try {
    const r = await api.post('/auth/customer/emailpass/reset-password', {
      identifier,
    });
    return r.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Generate Resetpassword token error';
    throw new Error(
      typeof message === 'string' ? message : JSON.stringify(message)
    );
  }
}

/**
 * logout: gọi server logout nếu muốn (best-effort), rồi xóa token local
 */
export async function logout() {
  try {
    // best-effort: một số Medusa có route /auth/customer/emailpass/logout
    try {
      await deleteToken();
    } catch {
      // ignore
    }
  } finally {
    await deleteToken();
  }
}

export default api;
