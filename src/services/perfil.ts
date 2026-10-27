import { api } from "../lib/axios";

export interface PerfilUsuario {
  usuario_id: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  rol_id: number;
  nombre_rol: string;
}

export async function obtenerPerfil(): Promise<PerfilUsuario> {
  const token = localStorage.getItem("access_token");

  const respuesta = await api.get<PerfilUsuario>("/auth/perfil", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return respuesta.data;
}
