import type { PedidoCliente } from "../../services/pedidosService";

interface HistorialPedidosProps {
  pedidos: PedidoCliente[];
  cargando: boolean;
  error: string;
  formatearFecha: (fecha: string) => string;
}

function HistorialPedidos({
  pedidos,
  cargando,
  error,
  formatearFecha,
}: HistorialPedidosProps) {
  return (
    <section className="mx-auto mt-14 max-w-7xl pb-8">
      <h2 className="mb-5 text-2xl font-bold">Mis pedidos</h2>

      {cargando && <p className="text-neutral-400">Cargando tus pedidos...</p>}

      {error && (
        <p className="rounded-xl bg-red-500/10 p-4 text-red-300">{error}</p>
      )}

      {!cargando && !error && pedidos.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#191919] p-6">
          <p className="font-semibold">Todavía no tienes pedidos.</p>
          <p className="mt-2 text-sm text-neutral-400">
            Tus pedidos aparecerán aquí cuando realices uno.
          </p>
        </div>
      )}

      {!cargando && !error && pedidos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pedidos.map((pedido) => (
            <article
              key={pedido.pedido_id}
              className="rounded-2xl border border-white/10 bg-[#191919] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold">Pedido #{pedido.pedido_id}</h3>

                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs text-orange-400">
                  {pedido.estado}
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold">
                Bs {Number(pedido.total_pedido).toFixed(2)}
              </p>

              <div className="mt-3 space-y-2 text-sm text-neutral-400">
                <p>Código: {pedido.token_recoger}</p>
                <p>Pago: {pedido.metodo_pago}</p>
                <p>
                  Estado del pago: {pedido.esta_pagado ? "Pagado" : "Pendiente"}
                </p>
                <p>Artículos: {pedido.items_count}</p>
                <p>Fecha: {formatearFecha(pedido.fecha_pedido)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistorialPedidos;
