import { api } from "../lib/axios";
import type { Plato } from "../types/plato";

export interface Menu {
  menu_dia_id: number;
  fecha: string;
  precio_menu: string;
  cantidad_disponible: number;
  publicado: boolean;
  info_nutricional: string | null;
  imagen_url: string | null;
  plato_principal: Plato;
  bebida: Plato | null;
  postre: Plato | null;
}

export interface Zona {
  zona_id: number;
  nombre_zona: string;
}

export async function obtenerMenus() {
  return api.get<Menu[]>("/catalogo/menus");
}

export async function obtenerZonas() {
  return api.get<Zona[]>("/catalogo/zonas");
}
