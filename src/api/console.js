import HttpClient from '@/utils/axios-base'
export default {
  get: () => HttpClient.get('system'),
  new: (system) => HttpClient.post('system', system),
  update: (systemId, systemName) => HttpClient.put(`system/${systemId}`, systemName),
  delete: (systemId) => HttpClient.delete(`system/${systemId}`),
};