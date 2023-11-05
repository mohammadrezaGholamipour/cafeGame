import HttpClient from '@/utils/axios-base'
export default {
  get: (query) => HttpClient.get('api/food', { params: query }),
  new: (food) => HttpClient.post('api/food', food),
  update: (foodId, food) => HttpClient.put(`api/food/${foodId}`, food),
  delete: (foodId) => HttpClient.delete(`api/food/${foodId}`),
};