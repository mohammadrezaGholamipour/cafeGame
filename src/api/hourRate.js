import HttpClient from '@/utils/axios-base'
export default {
  get: (data) => HttpClient.get('unit-price/my-unit-price', data),
  new: (unitPrice) => HttpClient.post('unit-price/create', unitPrice),
  delete: (unitPriceId) => HttpClient.delete(`unit-price/${unitPriceId}`),
};