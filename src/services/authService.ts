export function cerrarSesion() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("usuario");
  window.location.href = "/login";
}
