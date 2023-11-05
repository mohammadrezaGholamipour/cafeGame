import HttpClient from '@/utils/axios-base'
export default {
  get: (data) => HttpClient.get('api/hourRate', data),
  new: (money) => HttpClient.post('api/hourRate', money),
  delete: (moneyId) => HttpClient.delete(`api/hourRate/${moneyId}`),
};