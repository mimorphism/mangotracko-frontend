import axios from 'axios';
import AuthHeader from '../util/authHeaderHelper';
import TokenService from './TokenService';
import history from '../history';
import AuthService from './AuthService';

// export const baseUrl = "http://localhost:8080/api/user";
// export const baseUrl = "http://192.168.0.2:8080/api/user";
export const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL+'/api/user';




const resourceAxiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  });
  
  resourceAxiosInstance.interceptors.response.use(undefined, error => {
    const statusCode = error.response ? error.response.status : null;
  
    if (statusCode === 401) { 
           
        resourceAxiosInstance
    .get('/refreshtoken', {
      headers: AuthHeader.getRefreshTokenHeader()
    })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.setUser(response.data);
        console.log("succesfully set user tokens");
        history.go(0);
      }
    }).catch((response) => {
      if(response.errorCode == 500){
        AuthService.logout();
        history.push('/login');
      };
    });
    }
   
  
    if (statusCode >= 500) {

    return Promise.reject({
      message: "Server error",
      errorCode: statusCode
      });

    }

    if (statusCode === 403) {
      TokenService.removeUser();
      history.push('/login');
      history.go(0);
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

  export {resourceAxiosInstance};