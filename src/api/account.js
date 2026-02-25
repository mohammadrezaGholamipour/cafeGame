import HttpClient from '@/utils/axios-base'

export default {
  login: (data) => {
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.password);

    return HttpClient.post(
      'auth/login',
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  },

  register: (data) => HttpClient.post('auth/register', data),
};
