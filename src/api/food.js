import HttpClient from '@/utils/axios-base'
export default {
  get: (query) => HttpClient.get('buffet/my-buffet', { params: query }),
  new: (buffet) => HttpClient.post('buffet/create', buffet),
  update: (buffetId, buffet) => HttpClient.put(`buffet/update/${buffetId}`, buffet),
  delete: (buffetId) => HttpClient.delete(`buffet/${buffetId}`),
};