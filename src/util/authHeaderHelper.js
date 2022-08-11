import TokenService from "../services/TokenService";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }}

  const getAuthHeaderForLogout = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    return `Bearer ${user.accessToken }`;
  } else {
    return {};
  }}

  const getRefreshTokenHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.refreshToken) {
    return { "Authorization" : 'Bearer ' + user.refreshToken };
  } else {
    return {};
  }}

  const getRefreshTokenHeaderForLogout = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.refreshToken) {
    return `Bearer ${user.refreshToken }`;
  } else {
    return {};
  }}

const AuthHeader = {
  getAuthHeaderForLogout, getAuthHeader, getRefreshTokenHeader, getRefreshTokenHeaderForLogout
};
  export default AuthHeader;