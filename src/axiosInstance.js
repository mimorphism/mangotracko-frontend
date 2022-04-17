import axios from 'axios';

export const baseUrl = "http://localhost:8080";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  });
  
  axiosInstance.interceptors.response.use(undefined, error => {
    const statusCode = error.response ? error.response.status : null;
  
    if (statusCode === 401) {
      // logout user
    }
  
    if (statusCode >= 500) {
      // show server error
    }
  
    if (statusCode === 400) {
      // show bad request error
    }
  
    return Promise.reject(error);
  });

  export {axiosInstance};