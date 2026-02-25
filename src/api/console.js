import HttpClient from '@/utils/axios-base'
export default {
  get: () => HttpClient.get('console/my-console'),
  new: () => HttpClient.post('console/create'),
  delete: (consoleId) => HttpClient.delete(`console/${consoleId}`),
};