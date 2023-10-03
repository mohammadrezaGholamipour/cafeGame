import HttpClient from '@/utils/axios-base'
export default {
  get: () => HttpClient.get('food'),
  new: (food) => HttpClient.post('food', food),
  update: (foodId) => HttpClient.put(`food/${foodId}`),
  delete: (foodId) => HttpClient.delete(`food/${foodId}`),
};