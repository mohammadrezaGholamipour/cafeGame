import axios from 'axios';
////////////////////////////////
const HttpClient = axios.create({
  baseURL: 'https://cafegameapi.iran.liara.run/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
///////////////////////////////////
HttpClient.interceptors.request.use(
  (config) => {
    config.headers['authorization'] = `Bearer`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
///////////////////////////////////
HttpClient.interceptors.response.use(
  (response) => response.data || null,
  ////////////////////
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.log(error.code);
    }
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          break;
        case 401:
          break;
        case 403:
          break;
        case 404:
          break;
        case 405:
          break;
        case 408:
          break;
        case 411:
          break;
        case 413:
          break;
        case 414:
          break;
        case 415:
          break;
        case 500:
          break;
        case 501:
          break;
        case 502:
          break;
        case 503:
          break;
        case 504:
          break;
        case 505:
          break;
        default:
          console.log(`http client status : ${error.response.status}`);
      }
    }
    return Promise.reject(error);
  }
);
export default HttpClient;
