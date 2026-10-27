import { api } from "../lib/axios";

export interface PedidoCliente {
  pedido_id: number;
  token_recoger: string;
  estado: string;
  total_pedido: string;
  metodo_pago: string;
  esta_pagado: boolean;
  fecha_pedido: string;
  fecha_entrega: string | null;
  items_count: number;
}

export async function obtenerMisPedidos() {
  const token = localStorage.getItem("access_token");

  return api.get<PedidoCliente[]>("/pedidos/mis-pedidos", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
