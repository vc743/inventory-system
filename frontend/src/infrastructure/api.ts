import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/application/stores/auth.store";
import settings from "./settings";
import { toast } from "sonner";

const api = axios.create({
  baseURL: settings.baseApi,
  headers: {
    "Content-Type": "application/json",
  },
});

//Un interceptor es parecido a un middleware, ambos se ejecutan antes de que la solicitud llegue al server)

//Interceptor de Request el cual agrega el token a cada request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(settings.tokenKey);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const sentToken = error.config?.headers.Authorization;

    if (status === 401 && sentToken) {
      useAuthStore.getState().logout();
      toast.error("Tu sesión expiró. Inicia sesión de nuevo.");
    }

    return Promise.reject(error);
  }
);

export default api;
