import HttpClient from '@/utils/axios-base'
export default {
  get: () => HttpClient.get('food'),
  new: (food) => HttpClient.post('food', food),
  update: (foodId, food) => HttpClient.put(`food/${foodId}`, food),
  delete: (foodId) => HttpClient.delete(`food/${foodId}`),
};