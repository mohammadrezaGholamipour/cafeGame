import HttpClient from '@/utils/axios-base'
export default {
  login: (data) => HttpClient.post('auth/login', data),
};