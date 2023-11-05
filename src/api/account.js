import HttpClient from '@/utils/axios-base'
export default {
  login: (data) => HttpClient.post('api/auth/login', data),
  register: (data) => HttpClient.post('api/auth/register', data),
};