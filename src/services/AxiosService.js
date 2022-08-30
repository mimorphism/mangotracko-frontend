import axios from 'axios';
import { useEffect, useContext } from 'react';
import AuthService from './AuthService';
import history from '../history';
import AuthHeader from '../util/authHeaderHelper';
import TokenService from './TokenService';
import { UserContext } from './UserContext';

class AxiosService {

    constructor(url) {
        const options = {
            baseURL: url,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000,
        };
        this.service = axios.create(options);
    }
}

const resourceAxiosInstance = new AxiosService(process.env.REACT_APP_BACKEND_BASE_URL+'/api/user'); 
const authAxiosInstance = new AxiosService(process.env.REACT_APP_BACKEND_BASE_URL); 


const AxiosInterceptor = ({ children }) => {
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {

        const handleSuccess = response => {
            return response;
        }

        const handleError = error => {
            const statusCode = error.response ? error.response.status : null;
            const errorMsg = error.response ? error.response.data.message : null;
            if (statusCode === 401) {

                resourceAxiosInstance.service
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
                        if (response.errorCode == 500) {
                            dispatch({ type: 'LOGGED_OUT_SESSION_EXPIRED'});
                            TokenService.removeUser();
                            history.push('/login');
                        };
                    });
                return new Promise(() => {});

            }


            if (statusCode >= 500) {

                return Promise.reject({
                    message: "Server error",
                    errorCode: statusCode
                });

            }
            //logged out by another session
            if (statusCode === 403 &&
                errorMsg[0] === `Authorization attempt with invalid access token! User:${TokenService.getUsername()}`) {
                dispatch({ type: 'LOGGED_OUT_BY_ANOTHER_SESSION'});
                TokenService.removeUser();
                history.push('/login');
                return new Promise(() => {});
            }

            if (statusCode === 400) {
                return Promise.reject({
                    message: errorMsg,
                });
            }

            if (statusCode === 404) {
                return Promise.reject({
                    message: errorMsg,
                });
            }

            return Promise.reject(error);
        }

        const interceptor = resourceAxiosInstance.service.interceptors.response.use(handleSuccess, handleError);

        return () => resourceAxiosInstance.service.interceptors.response.eject(interceptor);


    }, [])
    return children;
}




export default AxiosService
export { AxiosInterceptor };
export { resourceAxiosInstance };
export { authAxiosInstance };

