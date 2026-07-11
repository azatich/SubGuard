import axios from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;  
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config?.url?.includes("/auth/login");
      const skipAuthRedirect = error.config?.skipAuthRedirect === true;

      if (!isAuthRequest && !skipAuthRedirect) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
