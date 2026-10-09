import api from "@/infrastructure/api";
import type {
  LoginForm,
  RegisterForm,
} from "@/infrastructure/schemas/auth/auth";
import type { AuthUser } from "@/application/stores/auth.store";
import { isAxiosError } from "axios";

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const login = async (formdata: LoginForm): Promise<AuthResponse> => {
  try {
    const url = "/auth/login";

    const response = await api.post<AuthResponse>(url, formdata);

    return response.data;

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Error de autenticación",
      );
    }
    throw new Error("Error de conexión con el servidor");
  }
};

export const register = async (
  formdata: RegisterForm,
): Promise<AuthResponse> => {
  try {
    const url = "/auth/register";

    const response = await api.post<AuthResponse>(url, formdata);

    return response.data;

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Error al registrar el usuario",
      );
    }
    throw new Error("Error de conexión con el servidor");
  }
};
