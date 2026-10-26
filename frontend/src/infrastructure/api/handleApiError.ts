import { isAxiosError } from "axios";
import { z } from "zod";

export function handleApiError(error: unknown, fallbackMessage: string): never {
  if (isAxiosError(error) && error.response) {
    throw new Error(
      error.response.data.error ||
        error.response.data.message ||
        fallbackMessage,
    );
  }
  if (error instanceof z.ZodError) {
    throw new Error("La respuesta del servidor no tiene el formato esperado");
  }
  throw new Error("Error de conexión con el servidor");
}
