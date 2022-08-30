import TokenService from './TokenService';
import { authAxiosInstance } from './AxiosService';
import AuthHeader from '../util/authHeaderHelper';
import { notifyLoading, notifyLoadingCallback } from '../util/utils';
import history from '../history';


const register = (username, password) => {
  notifyLoading('Registering your account...', 'register');
  return authAxiosInstance.service
    .post('/auth/registration', {"username": username,"password": password}, {
      headers:{"Content-Type": "application/json"}
    })
    .then((response) => {
      console.log(response);
         notifyLoadingCallback('You can now login', 'register',response.data.message, false );
    }).catch((error) => {
      console.log(error);
      notifyLoadingCallback(error.response.data.message, 'register', 'Registration failed!!', true );

    });
};

const login = (username, password) => {
  notifyLoading('Logging you in...', 'login');
  return authAxiosInstance.service
    .post('/api/auth/login', {"username": username,"password": password}, {
      // auth:{'username': username,'password: password},
      headers:{"Content-Type": "application/json"}
    })
    .then((response) => {
      if (response.data.accessToken) {
        notifyLoadingCallback('Hey there '+ username, 'login','Login succesful!', false );
        TokenService.setUser(response.data);
        history.push('/home')
      }
      return response.data;
    }).catch((error) => {
       notifyLoadingCallback(error.response.data.message, 'login','Login failed!', true );
       return new Promise(() => {});
    });
};


const logout = () => {
  notifyLoading('Logging you out...', 'logout');
  const username = TokenService.getUsername();
  const accessToken = AuthHeader.getAuthHeaderForLogout();
  const refreshToken = AuthHeader.getRefreshTokenHeaderForLogout();
  return authAxiosInstance.service
    .post('/logout', {"username": username}, {
      headers: 
      {
        Authorization:accessToken,
        Refresher:refreshToken
      }
    })
};

const AuthService = {
  login, logout, register
};

export default AuthService;