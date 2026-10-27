import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CocinaPage from "./pages/CocinaPage";
import ClientePage from "./pages/ClientePage";

type PerfilGuardado = {
  nombre_rol: string;
};

function rutaPorRol(nombreRol: string): string | null {
  const rol = nombreRol.trim().toLowerCase();

  if (rol === "administrador") return "/admin";
  if (rol === "cocina") return "/cocina";
  if (rol === "cliente") return "/cliente";

  return null;
}

function RutaProtegida({ rolRequerido }: { rolRequerido: string }) {
  const token = localStorage.getItem("access_token");
  const datosGuardados = localStorage.getItem("usuario");

  if (!token || !datosGuardados) {
    return <Navigate to="/" replace />;
  }

  let perfil: PerfilGuardado;

  try {
    perfil = JSON.parse(datosGuardados) as PerfilGuardado;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");
    return <Navigate to="/" replace />;
  }

  const rutaCorrecta = rutaPorRol(perfil.nombre_rol);

  if (!rutaCorrecta) {
    return <Navigate to="/" replace />;
  }

  if (rutaCorrecta !== rolRequerido) {
    return <Navigate to={rutaCorrecta} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<RutaProtegida rolRequerido="/admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<RutaProtegida rolRequerido="/cocina" />}>
          <Route path="/cocina" element={<CocinaPage />} />
        </Route>

        <Route element={<RutaProtegida rolRequerido="/cliente" />}>
          <Route path="/cliente" element={<ClientePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
