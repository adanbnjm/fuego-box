import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../lib/axios";
import { cerrarSesion } from "../services/authService";
import {
  obtenerMisPedidos,
  type PedidoCliente,
} from "../services/pedidosService";
import {
  obtenerMenus,
  obtenerZonas,
  type Menu,
  type Zona,
} from "../services/catalogoService";
import MenuCard from "../components/cliente/MenuCard";
import HistorialPedidos from "../components/cliente/HistorialPedidos";

interface PedidoCreado {
  pedido_id: number;
  token_recoger: string;
  estado: string;
  total_pedido: string;
  metodo_pago: string;
  esta_pagado: boolean;
  zona_id: number;
  direccion_referencia: string;
  fecha_pedido: string;
}

function ClientePage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);

  const [cargandoMenus, setCargandoMenus] = useState(true);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const [cargandoZonas, setCargandoZonas] = useState(true);

  const [errorMenus, setErrorMenus] = useState("");
  const [errorPedidos, setErrorPedidos] = useState("");
  const [errorZonas, setErrorZonas] = useState("");
  const [errorCrear, setErrorCrear] = useState("");

  const [menuSeleccionado, setMenuSeleccionado] = useState<Menu | null>(null);

  const [zonaId, setZonaId] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [creandoPedido, setCreandoPedido] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState<PedidoCreado | null>(null);

  useEffect(() => {
    const cargarMenus = async () => {
      try {
        const respuesta = await obtenerMenus();

        setMenus(respuesta.data.filter((menu) => menu.publicado));
      } catch (error) {
        console.error("Error al cargar menús:", error);
        setErrorMenus("No pudimos cargar los menús disponibles.");
      } finally {
        setCargandoMenus(false);
      }
    };

    const cargarZonas = async () => {
      try {
        const respuesta = await obtenerZonas();
        setZonas(respuesta.data);
      } catch (error) {
        console.error("Error al cargar zonas:", error);
        setErrorZonas("No pudimos cargar las zonas de entrega.");
      } finally {
        setCargandoZonas(false);
      }
    };
    const cargarPedidos = async () => {
      try {
        const respuesta = await obtenerMisPedidos();
        setPedidos(respuesta.data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        setErrorPedidos("No pudimos cargar tus pedidos.");
      } finally {
        setCargandoPedidos(false);
      }
    };
    void cargarMenus();
    void cargarZonas();
    void cargarPedidos();
  }, []);

  const formatearFecha = (fecha: string) =>
    new Date(`${fecha.slice(0, 10)}T12:00:00`).toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const elegirMenu = (menu: Menu) => {
    setMenuSeleccionado(menu);
    setCantidad(1);
    setZonaId("");
    setDireccion("");
    setErrorCrear("");
    setPedidoCreado(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const crearPedido = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorCrear("");
    setPedidoCreado(null);

    if (!menuSeleccionado) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      setErrorCrear("Tu sesión no está disponible. Inicia sesión nuevamente.");
      return;
    }

    if (!zonaId) {
      setErrorCrear("Selecciona una zona de entrega.");
      return;
    }

    if (!direccion.trim()) {
      setErrorCrear("Escribe tu dirección de referencia.");
      return;
    }

    if (cantidad < 1 || cantidad > menuSeleccionado.cantidad_disponible) {
      setErrorCrear("La cantidad supera el stock disponible.");
      return;
    }

    setCreandoPedido(true);

    try {
      const respuesta = await api.post<PedidoCreado>(
        "/pedidos/",
        {
          zona_id: Number(zonaId),
          direccion_referencia: direccion.trim(),
          metodo_pago: "Efectivo",
          items: [
            {
              menu_dia_id: menuSeleccionado.menu_dia_id,
              cantidad,
              exclusiones: [],
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPedidoCreado(respuesta.data);
      setMenuSeleccionado(null);

      // Actualizar el catálogo después de crear el pedido.
      const respuestaMenus = await obtenerMenus();

      setMenus(respuestaMenus.data.filter((menu) => menu.publicado));

      // Recargar los pedidos del cliente.
      const respuestaPedidos = await obtenerMisPedidos();

      setPedidos(respuestaPedidos.data);
      setErrorPedidos("");
    } catch (error: unknown) {
      console.error("Error al crear el pedido:", error);

      const errorApi = error as {
        response?: {
          data?: {
            detail?: string | { msg?: string }[];
            message?: string | string[];
          };
        };
      };

      const detalle = errorApi.response?.data?.detail;
      const mensaje = errorApi.response?.data?.message;

      if (typeof detalle === "string") {
        setErrorCrear(detalle);
      } else if (Array.isArray(detalle) && detalle.length > 0) {
        setErrorCrear(
          detalle
            .map((item) => item.msg ?? "Revisa los datos del pedido.")
            .join(" "),
        );
      } else if (typeof mensaje === "string") {
        setErrorCrear(mensaje);
      } else if (Array.isArray(mensaje)) {
        setErrorCrear(mensaje.join(" "));
      } else {
        setErrorCrear(
          "No pudimos crear el pedido. Revisa los datos e inténtalo nuevamente.",
        );
      }
    } finally {
      setCreandoPedido(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#101010] px-5 py-8 text-white sm:px-8">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.25em] text-orange-500">
            FUEGOBOX
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Tu espacio</h1>

          <p className="mt-2 text-neutral-400">
            Descubre nuestros menús y consulta tus pedidos.
          </p>
        </div>

        <button
          type="button"
          onClick={cerrarSesion}
          className="shrink-0 rounded-xl border border-orange-500/40 px-4 py-2.5 text-sm font-bold text-orange-400 transition hover:bg-orange-500 hover:text-black"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Confirmación del pedido */}
      {pedidoCreado && (
        <section className="mx-auto mt-8 max-w-7xl rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
          <p className="font-bold text-green-400">
            ¡Pedido creado correctamente!
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Pedido #{pedidoCreado.pedido_id}
          </h2>

          <p className="mt-3 text-neutral-300">Tu código de recogida es:</p>

          <p className="mt-1 text-3xl font-black tracking-widest text-orange-400">
            {pedidoCreado.token_recoger}
          </p>

          <p className="mt-3 text-neutral-300">
            Total: Bs {Number(pedidoCreado.total_pedido).toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-neutral-400">
            Estado: {pedidoCreado.estado} · Pago en efectivo
          </p>

          <button
            type="button"
            onClick={() => setPedidoCreado(null)}
            className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-black transition hover:bg-orange-400"
          >
            Continuar viendo menús
          </button>
        </section>
      )}
      {/* Formulario de pedido */}
      {menuSeleccionado && (
        <section
          id="formulario-pedido"
          className="mx-auto mt-8 max-w-3xl rounded-2xl border border-orange-500/30 bg-[#191919] p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-orange-400">
                Completa tu pedido
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {menuSeleccionado.plato_principal.nombre}
              </h2>

              <p className="mt-2 text-xl font-bold text-orange-400">
                Bs {Number(menuSeleccionado.precio_menu).toFixed(2)}{" "}
                <span className="text-sm font-normal text-neutral-400">
                  por menú
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuSeleccionado(null);
                setErrorCrear("");
              }}
              className="rounded-lg px-3 py-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={crearPedido} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="zona"
                className="mb-2 block text-sm font-semibold"
              >
                Zona de entrega
              </label>

              <select
                id="zona"
                value={zonaId}
                onChange={(event) => setZonaId(event.target.value)}
                required
                disabled={cargandoZonas || zonas.length === 0}
                className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-orange-500 disabled:opacity-50"
              >
                <option value="">
                  {cargandoZonas ? "Cargando zonas..." : "Selecciona tu zona"}
                </option>

                {zonas.map((zona) => (
                  <option key={zona.zona_id} value={zona.zona_id}>
                    {zona.nombre_zona}
                  </option>
                ))}
              </select>

              {errorZonas && (
                <p className="mt-2 text-sm text-red-400">{errorZonas}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="direccion"
                className="mb-2 block text-sm font-semibold"
              >
                Dirección de referencia
              </label>

              <textarea
                id="direccion"
                value={direccion}
                onChange={(event) => setDireccion(event.target.value)}
                required
                rows={3}
                maxLength={500}
                placeholder="Ej.: calle, número de casa, edificio o referencia..."
                className="w-full resize-y rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Escribe los datos necesarios para identificar tu dirección.
              </p>
            </div>

            <div>
              <label
                htmlFor="cantidad"
                className="mb-2 block text-sm font-semibold"
              >
                Cantidad de menús
              </label>

              <input
                id="cantidad"
                type="number"
                min={1}
                max={menuSeleccionado.cantidad_disponible}
                value={cantidad}
                onChange={(event) => setCantidad(Number(event.target.value))}
                required
                className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-orange-500"
              />

              <p className="mt-2 text-sm text-neutral-400">
                Disponibles: {menuSeleccionado.cantidad_disponible}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#101010] p-4">
              <p className="text-sm text-neutral-400">Método de pago</p>
              <p className="mt-1 font-semibold">Efectivo</p>
              <p className="mt-1 text-xs text-neutral-500">
                El pago se registrará según el proceso del backend.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="text-sm text-neutral-400">Total estimado</p>
                <p className="text-2xl font-black text-orange-400">
                  Bs{" "}
                  {(Number(menuSeleccionado.precio_menu) * cantidad).toFixed(2)}
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  creandoPedido ||
                  cargandoZonas ||
                  zonas.length === 0 ||
                  cantidad < 1 ||
                  cantidad > menuSeleccionado.cantidad_disponible
                }
                className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creandoPedido ? "Creando pedido..." : "Confirmar pedido"}
              </button>
            </div>

            {errorCrear && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {errorCrear}
              </p>
            )}
          </form>
        </section>
      )}

      <HistorialPedidos
        pedidos={pedidos}
        cargando={cargandoPedidos}
        error={errorPedidos}
        formatearFecha={formatearFecha}
      />

      {/* Catálogo */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Menú disponible</h2>
          <span className="text-sm text-neutral-400">{menus.length} menús</span>
        </div>

        {cargandoMenus && (
          <p className="text-neutral-400">Cargando catálogo...</p>
        )}

        {errorMenus && (
          <p className="rounded-xl bg-red-500/10 p-4 text-red-300">
            {errorMenus}
          </p>
        )}

        {!cargandoMenus && !errorMenus && menus.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-[#191919] p-5 text-neutral-400">
            No hay menús publicados disponibles.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <MenuCard
              key={menu.menu_dia_id}
              menu={menu}
              alElegir={elegirMenu}
              formatearFecha={formatearFecha}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ClientePage;
