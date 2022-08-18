import { authAxiosInstance } from './AuthAxiosInstance';
import TokenService from './TokenService';
import AuthHeader from '../util/authHeaderHelper';
import { notifyOKCustom,notifyKOCustom } from '../util/utils';

const register = (username, password) => {
  return authAxiosInstance
    .post('/auth/registration', {"username": username,"password": password}, {
      headers:{"Content-Type": "application/json"}
    })
    .then((response) => {
      console.log(response);
         notifyOKCustom(response.data.message, 'You can now login');
    }).catch((error) => {
      console.log(error);
       notifyKOCustom('Registration failed!', error.message);
    });
};

const login = (username, password) => {
  return authAxiosInstance
    .post('/api/auth/login', {"username": username,"password": password}, {
      // auth:{'username': username,'password: password},
      headers:{"Content-Type": "application/json"}
    })
    .then((response) => {
      if (response.data.accessToken) {
        notifyOKCustom('Login succesful!', 'Hey there ' + username);
        TokenService.setUser(response.data);
      }
      return response.data;
    }).catch((error) => {
      console.log(error);
       notifyKOCustom('Login failed!', error.message);
    });
};


const logout = () => {
  const username = TokenService.getUsername();
  const accessToken = AuthHeader.getAuthHeaderForLogout();
  const refreshToken = AuthHeader.getRefreshTokenHeaderForLogout();
  TokenService.removeUser();
  return authAxiosInstance
    .post('/logout', {"username": username}, {
      headers: 
      {
        Authorization:accessToken,
        Refresher:refreshToken
      }
    })
    .then((response) => {
      return response.data;
    });
};

const AuthService = {
  login, logout, register
};

export default AuthService;