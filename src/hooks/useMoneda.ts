import { useContext } from "react";
import { MonedaContext } from "../context/MonedaContext";

export function useMoneda() {
  const contexto = useContext(MonedaContext);

  if (contexto === null) {
    throw new Error("useMoneda debe utilizarse dentro de MonedaProvider");
  }

  return contexto;
}
