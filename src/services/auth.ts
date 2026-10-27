import { api } from "../lib/axios";
import type { LoginDTO, LoginResponse } from "../types/auth";

export async function iniciarSesion(datos: LoginDTO): Promise<LoginResponse> {
  const respuesta = await api.post<LoginResponse>("/auth/login", datos);

  return respuesta.data;
}
