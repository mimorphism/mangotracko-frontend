const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.refreshToken;
};
const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.accessToken;
};
const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.accessToken = token;
  localStorage.setItem("user", JSON.stringify(user));
};
const getUsername = () => {
  return JSON.parse(localStorage.getItem("user")).user;
};
const setUser = (user) => {
  console.log(JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};
const removeUser = () => {
  localStorage.removeItem("user");
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUsername,
  setUser,
  removeUser,
};
export default TokenService;