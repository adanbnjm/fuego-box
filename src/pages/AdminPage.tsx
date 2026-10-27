import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { api } from "../lib/axios";
import type { Plato } from "../types/plato";
import PlatosSection from "../components/admin/PlatosSection";
import MenusSection from "../components/admin/MenusSection";
import PedidosSection from "../components/admin/PedidosSection";
import EmpleadosSection from "../components/admin/EmpleadosSection";
import ClientesSection from "../components/admin/ClientesSection";

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

interface MenuDia {
  menu_dia_id: number;
  fecha: string;
  plato_principal_id: number;
  bebida_id: number;
  postre_id: number;
  cantidad_disponible: number;
  precio_menu: string;
  imagen_url: string | null;
  publicado: boolean;
}

interface Seccion {
  nombre: string;
  endpoint: string;
}
interface Empleado {
  usuario_id: number;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  rol_id: number;
  rol_nombre: string;
  zona_reparto_id: number | null;
  zona_nombre: string | null;
}
interface Cliente {
  usuario_id: number;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  rol_id: number;
  fecha_registro: string | null;
}

interface Metricas {
  fecha: string;
  total_pedidos: number;
  pedidos_por_estado: Record<string, number>;
  ventas_totales: string;
  ventas_por_metodo_pago: Record<string, unknown>;
  tiempo_promedio_preparacion: number;
  tiempo_promedio_entrega: number;
  pedidos_mas_rapidos: {
    pedido_id: number;
    token: string;
    minutos_total: number;
  }[];
  pedidos_mas_lentos: {
    pedido_id: number;
    token: string;
    minutos_total: number;
  }[];
}

const secciones: Seccion[] = [
  { nombre: "Pedidos", endpoint: "/admin/pedidos" },
  { nombre: "Menús", endpoint: "/admin/menu" },
  { nombre: "Platos", endpoint: "/admin/platos" },
  { nombre: "Empleados", endpoint: "/admin/empleados" },
  { nombre: "Clientes", endpoint: "/admin/clientes" },
  { nombre: "Métricas", endpoint: "/admin/kpis" },
];

function fechaBonita(fecha: string) {
  return new Date(fecha).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminPage() {
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState(secciones[0]);
  const [datos, setDatos] = useState<unknown>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      setCargando(true);
      setError("");
      setDatos(null);

      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const respuesta = await api.get<unknown>(seccion.endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (activo) setDatos(respuesta.data);
      } catch (errorApi) {
        if (!activo) return;

        if (axios.isAxiosError(errorApi)) {
          const estado = errorApi.response?.status;

          if (estado === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("usuario");
            navigate("/", { replace: true });
            return;
          }

          if (estado === 403) {
            setError("Tu cuenta no tiene permiso para consultar esta sección.");
          } else {
            setError(
              errorApi.response
                ? `La API respondió con el estado ${estado}.`
                : "No se pudo conectar con el servidor.",
            );
          }
        } else {
          setError("Ocurrió un error al cargar los datos.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarDatos();

    return () => {
      activo = false;
    };
  }, [seccion, navigate]);

  function cerrarSesion() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");
    navigate("/", { replace: true });
  }

  const pedidos: Pedido[] =
    seccion.nombre === "Pedidos" && Array.isArray(datos)
      ? (datos as Pedido[])
      : [];

  const menus: MenuDia[] = Array.isArray(datos) ? (datos as MenuDia[]) : [];

  const platos: Plato[] = Array.isArray(datos) ? (datos as Plato[]) : [];
  const empleados: Empleado[] = Array.isArray(datos)
    ? (datos as Empleado[])
    : [];
  const clientes: Cliente[] = Array.isArray(datos) ? (datos as Cliente[]) : [];

  const metricas: Metricas | null =
    seccion.nombre === "Métricas" &&
    datos !== null &&
    typeof datos === "object" &&
    !Array.isArray(datos)
      ? (datos as Metricas)
      : null;

  const esLista = Array.isArray(datos);
  const esPedidos = seccion.nombre === "Pedidos";

  return (
    <main className="min-h-screen bg-[#101010] text-white">
      <header className="border-b border-white/10 bg-[#171717]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-orange-500">
              FUEGOBOX
            </p>
            <h1 className="mt-1 text-2xl font-bold">Panel de administración</h1>
            <p className="mt-1 text-sm text-gray-400">
              Gestiona los datos de tu negocio desde un solo lugar.
            </p>
          </div>

          <button
            onClick={cerrarSesion}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:border-orange-500 hover:text-orange-400"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-8 flex flex-wrap gap-3">
          {secciones.map((item) => (
            <button
              key={item.nombre}
              onClick={() => {
                setSeccion(item);
                setBusqueda("");
                setFiltroEstado("Todos");
              }}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                seccion.nombre === item.nombre
                  ? "bg-orange-500 text-black"
                  : "border border-white/10 bg-[#191919] text-gray-300 hover:border-orange-500/60"
              }`}
            >
              {item.nombre}
            </button>
          ))}
        </nav>

        <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-orange-500">GESTIÓN DEL SISTEMA</p>
            <h2 className="mt-1 text-3xl font-bold">{seccion.nombre}</h2>
            <p className="mt-2 text-sm text-gray-400">
              Información cargada directamente desde la API.
            </p>
          </div>

          {!cargando && !error && seccion.nombre === "Menús" && (
            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">Menús programados</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Consulta las fechas, los precios y la disponibilidad.
                  </p>
                </div>

                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
                  {menus.length} menús registrados
                </span>
              </div>

              {menus.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#191919] p-10 text-center text-gray-400">
                  No hay menús registrados.
                </div>
              ) : (
                <MenusSection menus={menus} formatearFecha={fechaBonita} />
              )}
            </section>
          )}
          {!cargando && !error && seccion.nombre === "Platos" && (
            <section>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Catálogo de platos</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Explora los platos registrados en FUEGOBOX.
                  </p>
                </div>

                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
                  {platos.length} platos registrados
                </span>
              </div>
              {platos.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#191919] p-10 text-center text-gray-400">
                  No hay platos registrados.
                </div>
              ) : (
                <PlatosSection platos={platos} />
              )}
            </section>
          )}

          {!cargando && !error && seccion.nombre === "Empleados" && (
            <EmpleadosSection empleados={empleados} />
          )}
        </section>

        {!cargando && !error && seccion.nombre === "Clientes" && (
          <ClientesSection clientes={clientes} />
        )}

        {!cargando && !error && seccion.nombre === "Métricas" && metricas && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">Resumen del negocio</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Indicadores y actividad de FUEGOBOX.
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-[#191919] px-4 py-2 text-sm text-gray-300">
                {new Date(`${metricas.fecha}T12:00:00`).toLocaleDateString(
                  "es-BO",
                )}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-white/10 bg-[#191919] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Total de pedidos
                  </span>
                  <span className="text-xl">🛍️</span>
                </div>
                <p className="mt-4 text-3xl font-bold">
                  {metricas.total_pedidos}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Pedidos registrados en el resumen
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-[#191919] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Ventas totales</span>
                  <span className="text-xl">💰</span>
                </div>
                <p className="mt-4 text-3xl font-bold text-orange-400">
                  Bs {Number(metricas.ventas_totales).toFixed(2)}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Importe informado por la API
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-[#191919] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Preparación promedio
                  </span>
                  <span className="text-xl">👨‍🍳</span>
                </div>
                <p className="mt-4 text-3xl font-bold">
                  {metricas.tiempo_promedio_preparacion}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    min
                  </span>
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Tiempo medio de preparación
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-[#191919] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Entrega promedio
                  </span>
                  <span className="text-xl">🚚</span>
                </div>
                <p className="mt-4 text-3xl font-bold">
                  {metricas.tiempo_promedio_entrega}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    min
                  </span>
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Tiempo medio de entrega
                </p>
              </article>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-[#191919] p-6">
                <h4 className="text-lg font-bold">Pedidos por estado</h4>
                <p className="mb-6 mt-1 text-sm text-gray-400">
                  Distribución de los pedidos registrados.
                </p>

                <div className="space-y-5">
                  {Object.entries(metricas.pedidos_por_estado).map(
                    ([estado, cantidad]) => {
                      const maximo = Math.max(
                        ...Object.values(metricas.pedidos_por_estado),
                        1,
                      );

                      return (
                        <div key={estado}>
                          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="text-gray-300">{estado}</span>
                            <span className="font-semibold text-white">
                              {cantidad}
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-orange-500 transition-all duration-500"
                              style={{ width: `${(cantidad / maximo) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-[#191919] p-6">
                <h4 className="text-lg font-bold">Tiempos de pedidos</h4>
                <p className="mb-6 mt-1 text-sm text-gray-400">
                  Pedidos destacados según el tiempo total informado por la API.
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-sm font-semibold text-green-400">
                      Pedido más rápido
                    </p>
                    {metricas.pedidos_mas_rapidos.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No hay datos disponibles.
                      </p>
                    ) : (
                      metricas.pedidos_mas_rapidos.map((pedido) => (
                        <div
                          key={`${pedido.pedido_id}-${pedido.token}`}
                          className="mb-2 rounded-xl border border-white/10 bg-[#222222] p-4"
                        >
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <p className="font-bold">
                                Pedido #{pedido.pedido_id}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                Token: {pedido.token}
                              </p>
                            </div>
                            <p className="font-bold text-green-400">
                              {pedido.minutos_total} min
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-red-400">
                      Pedido más lento
                    </p>
                    {metricas.pedidos_mas_lentos.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No hay datos disponibles.
                      </p>
                    ) : (
                      metricas.pedidos_mas_lentos.map((pedido) => (
                        <div
                          key={`${pedido.pedido_id}-${pedido.token}`}
                          className="mb-2 rounded-xl border border-white/10 bg-[#222222] p-4"
                        >
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <p className="font-bold">
                                Pedido #{pedido.pedido_id}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                Token: {pedido.token}
                              </p>
                            </div>
                            <p className="font-bold text-red-400">
                              {pedido.minutos_total} min
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </article>
            </div>

            <article className="rounded-2xl border border-white/10 bg-[#191919] p-6">
              <h4 className="text-lg font-bold">Ventas por método de pago</h4>
              {Object.keys(metricas.ventas_por_metodo_pago).length === 0 ? (
                <p className="mt-3 text-sm text-gray-400">
                  La API no ha informado ventas desglosadas por método de pago.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(metricas.ventas_por_metodo_pago).map(
                    ([metodo, valor]) => (
                      <div
                        key={metodo}
                        className="rounded-xl border border-white/10 bg-[#222222] p-4"
                      >
                        <p className="text-sm text-gray-400">{metodo}</p>
                        <p className="mt-2 font-bold text-orange-400">
                          {typeof valor === "object"
                            ? JSON.stringify(valor)
                            : String(valor)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </article>
          </section>
        )}

        {cargando && (
          <div className="rounded-2xl border border-white/10 bg-[#191919] p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="text-gray-400">Consultando la API...</p>
          </div>
        )}

        {!cargando && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <p className="font-semibold text-red-400">{error}</p>
            <button
              onClick={() => setSeccion({ ...seccion })}
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-black"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && esPedidos && (
          <PedidosSection
            pedidos={pedidos}
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            filtroEstado={filtroEstado}
            onFiltroEstadoChange={setFiltroEstado}
            formatearFecha={fechaBonita}
          />
        )}

        {!cargando &&
          !error &&
          !esPedidos &&
          seccion.nombre !== "Menús" &&
          seccion.nombre !== "Platos" &&
          seccion.nombre !== "Empleados" &&
          seccion.nombre !== "Clientes" &&
          seccion.nombre !== "Métricas" && (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#191919] p-6">
              {esLista && datos.length === 0 ? (
                <p className="text-gray-400">No hay registros disponibles.</p>
              ) : (
                <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-gray-300">
                  {JSON.stringify(datos, null, 2)}
                </pre>
              )}
            </div>
          )}
      </div>
    </main>
  );
}

export default AdminPage;
