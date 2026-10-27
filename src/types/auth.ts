export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario_id: number;
  rol_id: number;
  nombre_completo: string;
  email: string;
}
