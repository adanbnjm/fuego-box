import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { iniciarSesion } from "../services/auth";
import { obtenerPerfil } from "../services/perfil";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      // 1. Iniciar sesión en la API
      const respuesta = await iniciarSesion({ email, password });

      // 2. Guardar temporalmente el token para consultar el perfil
      localStorage.setItem("access_token", respuesta.access_token);

      // 3. Consultar el perfil real del usuario
      const perfil = await obtenerPerfil();

      // No incluimos un panel para Delivery
      if (perfil.nombre_rol.trim().toLowerCase() === "delivery") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("usuario");
        setError("El acceso para el rol Delivery no está disponible.");
        return;
      }

      // 4. Guardar los datos completos del perfil
      localStorage.setItem("usuario", JSON.stringify(perfil));

      // 5. Redirigir según el rol
      const rol = perfil.nombre_rol.trim().toLowerCase();

      if (rol === "administrador") {
        navigate("/admin", { replace: true });
      } else if (rol === "cocina") {
        navigate("/cocina", { replace: true });
      } else if (rol === "cliente") {
        navigate("/cliente", { replace: true });
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("usuario");
        setError("Tu rol no tiene un panel disponible en esta aplicación.");
      }
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("usuario");

      if (isAxiosError(error)) {
        const data = error.response?.data as
          | { detail?: string | { msg?: string }[] }
          | undefined;

        const detalle = data?.detail;

        if (typeof detalle === "string") {
          setError(detalle);
        } else if (Array.isArray(detalle)) {
          setError(
            detalle.map((item) => item.msg ?? "Dato inválido").join(", "),
          );
        } else {
          setError(
            "No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.",
          );
        }
      } else {
        setError("Ocurrió un error inesperado. Inténtalo nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101010] px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#191919] p-8 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold tracking-[0.3em] text-orange-500">
            FUEGOBOX
          </p>

          <h1 className="mt-5 text-3xl font-bold">Bienvenido de nuevo</h1>

          <p className="mt-3 text-sm text-neutral-400">
            Ingresa a tu cuenta para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-neutral-300"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              required
              className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-neutral-300"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Verificando acceso..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-500">
          FUEGOBOX · Gestión de pedidos y menús
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
