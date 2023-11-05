import HttpClient from '@/utils/axios-base'
export default {
  get: () => HttpClient.get('api/system'),
  new: (system) => HttpClient.post('api/system', system),
  update: (systemId, systemName) => HttpClient.put(`api/system/${systemId}`, systemName),
  delete: (systemId) => HttpClient.delete(`api/system/${systemId}`),
};