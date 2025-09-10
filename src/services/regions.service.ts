import api from '../api/api';

export async function listRegions() {
  const res = await api.get('/store/regions');
  return res.data.regions;
}
