import api from '../api/api';
import { MEDUSA_BASE_URL, MEDUSA_PUBLISHABLE_KEY } from '../config';
import axios from 'axios';

export async function listProducts(regionId: string) {
  try {
    const r = await api.get(`/store/products?region_id=${regionId}`);
    return r;
  } catch (error) {
    console.error('Error listing products:', error);
  }
}
