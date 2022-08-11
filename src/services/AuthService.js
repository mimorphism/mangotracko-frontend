import { Token } from 'graphql';
import { authAxiosInstance } from './AuthAxiosInstance';
import TokenService from './TokenService';
import AuthHeader from '../util/authHeaderHelper';

const register = (username, email, password) => {
  return authAxiosInstance.post("/signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return authAxiosInstance
    .post('/api/auth/login', {"username": username,"password": password}, {
      // auth:{'username': username,'password: password},
      headers:{"Content-Type": "application/x-www-form-urlencoded"}
    })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.setUser(response.data);
      }
      return response.data;
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