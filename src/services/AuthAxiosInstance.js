import axios from 'axios';
import AuthHeader from '../util/authHeaderHelper';
import TokenService from './TokenService';

// export const baseUrl = "http://localhost:8080";
// export const baseUrl = "http://192.168.0.2:8080";
export const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;


const authAxiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  });
  
  authAxiosInstance.interceptors.response.use(undefined, error => {
    const statusCode = error.response ? error.response.status : null;
  
    if (statusCode === 401) {      
       return Promise.reject({
      message: error.response.data.message,
      }); 
    }
   
  
    if (statusCode >= 500) {

    return Promise.reject({
      message: "Server error",
      errorCode: statusCode
      });

    }

    if (statusCode === 403) {
      return Promise.reject({
      message: error.response.data.message,
      }); 
    }
  
    if (statusCode === 400) {
      return Promise.reject({
      message: error.response.data.message,
      }); 
    }

    if (statusCode === 404) {
      return Promise.reject({
      message: error.response.data.message,
      });
    }
  
    return Promise.reject(error);
  });

  export {authAxiosInstance};