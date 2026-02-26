import HttpClient from '@/utils/axios-base'
export default {
  get: (query) => HttpClient.get('bill/my-bills', { params: query }),
  start: (data) => HttpClient.post(`bill/create`, data),
  close: (billId) => HttpClient.put(`bill/${billId}/close`),
  delete: (billId) => HttpClient.delete(`bill/remove-bill/${billId}`),
  update: (billId, data) => HttpClient.put(`bill/update-bill/${billId}`, data),
  open: () => HttpClient.get('bill/my-open-bills'),
};