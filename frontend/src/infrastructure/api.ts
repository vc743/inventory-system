import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import settings from "./settings";
import toast from "react-hot-toast";

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

//Interceptor de Response el cual maneja errores globales
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          //Token invalido o expirado
          localStorage.removeItem(settings.tokenKey);
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");

          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;

        case 403:
          toast.error("No tienes permisos para realizar esta accion.");
          break;

        case 404:
          toast.error(data?.error || "Recurso no encontrado.");
          break;

        case 400:
          //Errores de validacion
          if (data?.details && Array.isArray(data.details)) {
            data.details.forEach((detail: string) => {
              toast.error(detail);
            });
          } else {
            toast.error(data?.error || "Datos invalidos.");
          }
          break;

        case 500:
          toast.error("Error del servidor. Por favor, intenta mas tarde.");
          break;

        default:
          toast.error(data?.error || "Ocurrio un error inesperado");
      }
    } else if (error.request) {
      //En caso que no haya respuesta del servidor
      toast.error("No se pudo conectar con el servidor.");
    } else {
      //Error en la configuracion de la peticion
      toast.error("Error al procesar la solicitud");
    }

    return Promise.reject(error);
  },
);

export default api;
