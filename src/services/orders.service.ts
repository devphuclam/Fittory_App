// services/orders.service.ts
import api from '../api/api';

export async function getOrder(orderId: string) {
  try {
    const res = await api.get(`/store/orders/${orderId}`);
    return res.data;
  } catch (error) {
    console.error('Error getting order:', error);
  }
}

export async function getListOrder() {
  try {
    const res = await api.get('/store/orders'); // endpoint Medusa
    return res.data;
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}
