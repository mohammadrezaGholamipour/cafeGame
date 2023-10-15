import HttpClient from '@/utils/axios-base'
export default {
  get: (query) => HttpClient.get('food', { params: query }),
  new: (food) => HttpClient.post('food', food),
  update: (foodId, food) => HttpClient.put(`food/${foodId}`, food),
  delete: (foodId) => HttpClient.delete(`food/${foodId}`),
};