import HttpClient from '@/utils/axios-base'
export default {
  get: (data) => HttpClient.get('hourRate', data),
  new: (money) => HttpClient.post('hourRate', money),
  delete: (moneyId) => HttpClient.delete(`hourRate/${moneyId}`),
};