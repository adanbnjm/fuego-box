interface Pedido {
  pedido_id: number;
  token_recoger: string;
  estado: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  zona_nombre: string;
  delivery_nombre: string | null;
  total_pedido: string;
  fecha_pedido: string;
  fecha_confirmado: string | null;
  fecha_listo_cocina: string | null;
  fecha_en_reparto: string | null;
  fecha_entrega: string | null;
}

interface PedidosSectionProps {
  pedidos: Pedido[];
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  filtroEstado: string;
  onFiltroEstadoChange: (valor: string) => void;
  formatearFecha: (fecha: string) => string;
}

function PedidosSection({
  pedidos,
  busqueda,
  onBusquedaChange,
  filtroEstado,
  onFiltroEstadoChange,
  formatearFecha,
}: PedidosSectionProps) {
  const texto = busqueda.toLowerCase();

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideBusqueda = [
      pedido.pedido_id.toString(),
      pedido.token_recoger,
      pedido.cliente_nombre,
      pedido.cliente_email,
      pedido.zona_nombre,
    ].some((valor) => valor.toLowerCase().includes(texto));

    const coincideEstado =
      filtroEstado === "Todos" || pedido.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const estados = [...new Set(pedidos.map((pedido) => pedido.estado))];

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={busqueda}
          onChange={(evento) => onBusquedaChange(evento.target.value)}
          placeholder="Buscar por pedido, cliente, correo o token..."
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-orange-500"
        />

        <select
          value={filtroEstado}
          onChange={(evento) => onFiltroEstadoChange(evento.target.value)}
          className="rounded-xl border border-white/10 bg-[#191919] px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          <option value="Todos">Todos los estados</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#191919]">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-b border-white/10 bg-[#222222] text-gray-400">
            <tr>
              <th className="px-5 py-4">Pedido</th>
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Zona</th>
              <th className="px-5 py-4">Repartidor</th>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {pedidosFiltrados.map((pedido) => (
              <tr
                key={pedido.pedido_id}
                className="transition hover:bg-white/[0.03]"
              >
                <td className="px-5 py-5">
                  <p className="font-bold text-orange-400">
                    #{pedido.pedido_id}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Token: {pedido.token_recoger}
                  </p>
                </td>

                <td className="px-5 py-5">
                  <p className="font-semibold">{pedido.cliente_nombre}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {pedido.cliente_email}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {pedido.cliente_telefono || "Sin teléfono"}
                  </p>
                </td>

                <td className="px-5 py-5 text-gray-300">
                  {pedido.zona_nombre}
                </td>

                <td className="px-5 py-5 text-gray-300">
                  {pedido.delivery_nombre?.trim() || "Sin asignar"}
                </td>

                <td className="px-5 py-5 text-gray-300">
                  {formatearFecha(pedido.fecha_pedido)}
                </td>

                <td className="px-5 py-5 font-bold">
                  Bs {Number(pedido.total_pedido).toFixed(2)}
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      pedido.estado === "Entregado"
                        ? "bg-green-500/10 text-green-400"
                        : pedido.estado === "Cancelado"
                          ? "bg-red-500/10 text-red-400"
                          : pedido.estado === "En Cocina"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {pedido.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pedidosFiltrados.length === 0 && (
          <p className="p-10 text-center text-gray-400">
            No se encontraron pedidos con esos filtros.
          </p>
        )}
      </div>
    </section>
  );
}

export default PedidosSection;
